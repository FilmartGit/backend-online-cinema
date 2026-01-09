import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { UserService } from './user.service'
import { getProfileDto } from './dto/getProfile.dto'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { UserDecor } from './decorators/user.decorator'
import { UpdateUserDto } from './dto/updateUser.dto'
import { IdValidationPipe } from 'src/pipes/id.validation.pipe'

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @Auth()
  @HttpCode(200)
  async getProfile(@UserDecor('_id') id: string): Promise<any> {
    return await this.userService.findById(id)
  }

  @Get('count')
  @Auth('admin')
  @HttpCode(200)
  async getCountUsers(): Promise<any> {
    return await this.userService.getcount()
  }

  @Get()
  @Auth('admin')
  @HttpCode(200)
  async getAllUsers(@Query('searchTerm') searchTerm?: string): Promise<any> {
    return await this.userService.getAll(searchTerm)
  }
  
  @Get(":id")
  @Auth('admin')
  @HttpCode(200)
  async getUser(@Param('id', IdValidationPipe) id: string): Promise<any> {
    return await this.userService.findById(id)
  }

  @UsePipes(new ValidationPipe())
  @Put('profile')
  @HttpCode(200)
  @Auth()
  async updateProfile(
    @UserDecor('_id') id: string,
    @Body() dto: UpdateUserDto
  ) {
    return await this.userService.updateProfile(id, dto)
  }

  @UsePipes(new ValidationPipe())
  @Put(':id')
  @HttpCode(200)
  @Auth('admin')
  async updateUser(
    @Param('id', IdValidationPipe) id: string,
    @Body() dto: UpdateUserDto
  ) {
    return await this.userService.updateProfile(id, dto)
  }

  @Delete(':id')
  @HttpCode(200)
  @Auth('admin')
  async deletedUser(@Param('id', IdValidationPipe) id: string) {
    return await this.userService.deleteUser(id)
  }
}
