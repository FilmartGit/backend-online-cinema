import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User } from 'src/user/schema/user.schema'
import { AuthDto } from './dto/auth.dto'
import { hash, genSalt, compare } from 'bcryptjs'
import { JwtService } from '@nestjs/jwt'
import { RefreshTokenDto } from './dto/refreshToken.dto'

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly jwtService: JwtService
  ) {}

  // Регистрация нового пользователя
  async registration(dto: AuthDto) {
    const findUser = await this.userModel.findOne({ email: dto.email }).exec()
    if (findUser) {
      throw new BadRequestException(
        'Пользователь с таким email уже существует!'
      )
    }

    const salt = await genSalt(10) // Генерация соли, нужна для hash
    const newUser = new this.userModel({
      ...dto,
      password: await hash(dto.password, salt),
    })
    newUser.save()

    // Создание токенов
    const tokens = await this.issueIdToken(String(newUser._id))
    // Возврат пользователя и токенов
    return {
      user: this.returnUserFields(newUser),
      ...tokens,
    }
  }

  // Авторизация пользователя
  async login(dto: AuthDto) {
    const user = await this.validateUser(dto)
    const tokens = await this.issueIdToken(String(user._id))
    // Возврат пользователя и токенов
    return {
      user: this.returnUserFields(user),
      ...tokens,
    }
  }

  // Получение новых токенов
  async getNewTokens({ refreshToken }: RefreshTokenDto) {
    if (!refreshToken)
      throw new UnauthorizedException('Пожалуйста авторизуйтесь!')

    // Проверка refreshToken
    const res = await this.jwtService.verifyAsync(refreshToken)
    if (!res) throw new UnauthorizedException('Пожалуйста авторизуйтесь!')

    // Поиск пользователя
    const user = await this.userModel.findById(res._id).exec()
    if (!user) throw new BadRequestException('Пользователь не обнаружен')

    // Создание токенов
    const tokens = await this.issueIdToken(String(user._id))

    // Возврат пользователя и токенов
    return {
      user: this.returnUserFields(user),
      ...tokens,
    }
  }

  // Валидация пользователя
  async validateUser(dto: AuthDto) {
    const findUser = await this.userModel.findOne({ email: dto.email }).exec()
    if (!findUser) throw new UnauthorizedException('Пользователь не найден!')

    // Проверка пароля
    const isValidePassword = await compare(dto.password, findUser.password)
    if (!isValidePassword) throw new UnauthorizedException('Пароль не верный!')

    return findUser
  }

  // Создание токенов
  async issueIdToken(userId: string) {
    const data = { _id: userId }
    const refreshToken = await this.jwtService.signAsync(data, {
      expiresIn: '14d',
    })
    const accessToken = await this.jwtService.signAsync(data, {
      expiresIn: '1h',
    })
    return { refreshToken, accessToken }
  }

  returnUserFields(user: User) {
    return {
      _id: user._id,
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin,
    }
  }
}
