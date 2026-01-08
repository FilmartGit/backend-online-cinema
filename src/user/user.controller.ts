import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
} from '@nestjs/common'
import { UserService } from './user.service'
import { getProfileDto } from './dto/getProfile.dto'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { UserDecor } from './decorators/user.decorator'

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @Auth()
  @HttpCode(200)
  async getProfile(@UserDecor('_id') id: string): Promise<any> {
    return await this.userService.findById(id)
  }
}
