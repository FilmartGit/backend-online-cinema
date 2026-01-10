import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { ActorService } from './actor.service'
import { IdValidationPipe } from 'src/pipes/id.validation.pipe'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { ActorDto } from './dto/actor.dto'

@Controller('actors')
export class ActorController {
  constructor(private readonly actorService: ActorService) {}

  @Get('by-slug/:slug')
  async getSlug(@Param('slug') slug: string): Promise<any> {
    return await this.actorService.getSlug(slug)
  }

  @Get()
  @HttpCode(200)
  async getAll(@Query('searchTerm') searchTerm?: string): Promise<any> {
    return await this.actorService.getAll(searchTerm)
  }

  @Get(':id')
  @Auth('admin')
  async get(@Param('id', IdValidationPipe) id: string): Promise<any> {
    return await this.actorService.findById(id)
  }

  @UsePipes(new ValidationPipe())
  @Put(':id')
  @HttpCode(200)
  @Auth('admin')
  async update(
    @Param('id', IdValidationPipe) id: string,
    @Body() dto: ActorDto
  ) {
    return await this.actorService.update(id, dto)
  }

  @UsePipes(new ValidationPipe())
  @Post('create')
  @HttpCode(200)
  @Auth('admin')
  async create() {
    return await this.actorService.create()
  }

  @Delete(':id')
  @HttpCode(200)
  @Auth('admin')
  async delete(@Param('id', IdValidationPipe) id: string) {
    return await this.actorService.deleteactor(id)
  }
}
