import {
  Body,
  Controller,
  HttpCode,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthDto } from './dto/auth.dto'
import { RefreshTokenDto } from './dto/refreshToken.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ValidationPipe()) // Нужно, чтобы наше DTO валидировалось
  @HttpCode(200) // Возврат 200 кода, потому что Post возвращает 201
  @Post('register')
  async registration(@Body() dto: AuthDto) {
    return this.authService.registration(dto)
  }

  @UsePipes(new ValidationPipe()) // Нужно, чтобы наше DTO валидировалось
  @HttpCode(200) // Возврат 200 кода, потому что Post возвращает 201
  @Post('login/access-token')
  async newTokens(@Body() dto: RefreshTokenDto) {
    return this.authService.getNewTokens(dto)
  }

  @UsePipes(new ValidationPipe()) // Нужно, чтобы наше DTO валидировалось
  @HttpCode(200) // Возврат 200 кода, потому что Post возвращает 201
  @Post('login')
  async login(@Body() dto: AuthDto) {
    return this.authService.login(dto)
  }
}
