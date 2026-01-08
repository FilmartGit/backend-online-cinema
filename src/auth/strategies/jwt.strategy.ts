import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectModel } from '@nestjs/mongoose'
import { PassportStrategy } from '@nestjs/passport'
import { Model } from 'mongoose'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { User } from 'src/user/schema/user.schema'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    @InjectModel(User.name) private readonly userModel: Model<User>
  ) {
    
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Извлечение токена из заголовка Authorization
      ignoreExpiration: false, // Игнорировать истечение срока действия токена
      secretOrKey: configService.get('JWT_SECRET')!, // Секретный ключ для подписи токена
    })
  }

  async validate({ _id }: Pick<User, '_id'>) {
    return await this.userModel.findById(_id).exec()
  }
}
