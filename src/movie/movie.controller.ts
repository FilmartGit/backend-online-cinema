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
import { MovieService } from './movie.service'
import { IdValidationPipe } from 'src/pipes/id.validation.pipe'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CreateMovieDto } from './dto/createMovie.dto'
import { Types } from 'mongoose'
import { UpdateCountopenedDto } from './dto/updateCouuntopened.dto'

@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get('by-slug/:slug')
  async getSlug(@Param('slug') slug: string): Promise<any> {
    return await this.movieService.getSlug(slug)
  }

  @Get('by-actor/:actorId')
  async getActor(
    @Param('actorId', IdValidationPipe) actorId: Types.ObjectId
  ): Promise<any> {
    return await this.movieService.byActor(actorId)
  }

  @Post('by-genres')
  @HttpCode(200)
  async getGenres(
    @Body('genresIds') genresIds: Types.ObjectId[]
  ): Promise<any> {
    return await this.movieService.byGenres(genresIds)
  }

  @Get()
  @HttpCode(200)
  async getAll(@Query('searchTerm') searchTerm?: string): Promise<any> {
    return await this.movieService.getAll(searchTerm)
  }

  @Get('most-popular')
  @HttpCode(200)
  async getMostPopular(): Promise<any> {
    return await this.movieService.getMostPopular()
  }

  @Post('update-count-opened')
  @HttpCode(200)
  async updateCounOpened(@Body() dto: UpdateCountopenedDto) {
    return await this.movieService.updateCountOpened(dto)
  }

  @Get(':id')
  @Auth('admin')
  async get(@Param('id', IdValidationPipe) id: string): Promise<any> {
    return await this.movieService.findById(id)
  }

  @UsePipes(new ValidationPipe())
  @Put(':id')
  @HttpCode(200)
  @Auth('admin')
  async update(
    @Param('id', IdValidationPipe) id: string,
    @Body() dto: CreateMovieDto
  ) {
    return await this.movieService.update(id, dto)
  }

  @UsePipes(new ValidationPipe())
  @Post('create')
  @HttpCode(200)
  @Auth('admin')
  async create() {
    return await this.movieService.create()
  }

  @Delete(':id')
  @HttpCode(200)
  @Auth('admin')
  async delete(@Param('id', IdValidationPipe) id: string) {
    return await this.movieService.deletemovie(id)
  }
}

