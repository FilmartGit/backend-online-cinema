import {
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
import { Auth } from 'src/auth/decorators/auth.decorator'
import { GenreService } from './genre.service'
import { IdValidationPipe } from 'src/pipes/id.validation.pipe'
import { CreateGenreDto } from './dto/createGenre.dto'

@Controller('genres')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @Get('by-slug/:slug')
  async getSlug(@Param('slug') slug: string): Promise<any> {
    return await this.genreService.getSlug(slug)
  }

  @Get('collections')
  async getCollections(): Promise<any> {
    return await this.genreService.getCollections()
  }

  @Get()
  @HttpCode(200)
  async getAll(@Query('searchTerm') searchTerm?: string): Promise<any> {
    return await this.genreService.getAll(searchTerm)
  }

  @Get(':id')
  @Auth('admin')
  async get(@Param('id', IdValidationPipe) id: string): Promise<any> {
    return await this.genreService.findById(id)
  }

  @UsePipes(new ValidationPipe())
  @Put(':id')
  @HttpCode(200)
  @Auth('admin')
  async update(
    @Param('id', IdValidationPipe) id: string,
    @Body() dto: CreateGenreDto
  ) {
    return await this.genreService.update(id, dto)
  }

  @UsePipes(new ValidationPipe())
  @Post('create')
  @HttpCode(200)
  @Auth('admin')
  async create() {
    return await this.genreService.create()
  }

  @Delete(':id')
  @HttpCode(200)
  @Auth('admin')
  async delete(@Param('id', IdValidationPipe) id: string) {
    return await this.genreService.deleteGenre(id)
  }
}
