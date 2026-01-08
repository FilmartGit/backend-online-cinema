import { Injectable, NotFoundException } from '@nestjs/common'
import { User } from './schema/user.schema'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>
  ) {}

  async findById(id: string) {
    const user = await this.userModel.findById(id)
    if (!user) throw new NotFoundException('Пользователь не найден')

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      favorites: user?.favorites,
    }
  }
}
