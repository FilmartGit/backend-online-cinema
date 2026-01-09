import { Injectable, NotFoundException } from '@nestjs/common'
import { User } from './schema/user.schema'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { UpdateUserDto } from './dto/updateUser.dto'
import { genSalt, hash } from 'bcryptjs'

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>
  ) {}

  async findById(id: string) {
    const user = await this.userModel.findById(id)
    if (!user) throw new NotFoundException('Пользователь не найден')

    return user
  }

  // Обновление профиля пользователя
  async updateProfile(_id: string, dto: UpdateUserDto) {
    const user = await this.findById(_id)
    const someUser = await this.userModel.findOne({ email: dto.email })

    if (someUser && String(_id) === String(someUser._id))
      throw new NotFoundException('Email уже занят!')

    user.name = dto?.name
    user.email = dto?.email

    if (dto.password) {
      const salt = await genSalt(10)
      user.password = await hash(dto.password, salt)
    }

    if (dto.isAdmin || dto.isAdmin === false) {
      user.isAdmin = dto.isAdmin
    }

    await user.save()
    return
  }

  async getcount() {
    return await this.userModel.find().countDocuments().exec()
  }

  async getAll(searchTerm?: string) {
    let options = {}
    if (searchTerm) {
      options = {
        $or: [
          {
            email: new RegExp(searchTerm, 'i'),
          },
        ],
      }
    }

    return await this.userModel
      .find(options)
      .select('-password -updatedAt -__v')
      .sort({ createdAt: 'desc' })
      .exec()
  }

  async deleteUser(id: string) {
    return await this.userModel.findByIdAndDelete(id).exec()
  }
}
