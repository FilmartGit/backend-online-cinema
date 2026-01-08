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

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  // @Auth()
  @HttpCode(200)
  async getProfile(@Body() dto: any): Promise<any> {
    return await this.userService.findById(dto)
  }
}
