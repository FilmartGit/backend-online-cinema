import { Module } from '@nestjs/common'
import { GenreController } from './genre.controller'
import { GenreService } from './genre.service'
import { MongooseModule } from '@nestjs/mongoose'
import { Genre, GenreSchema } from './schema/genre.schema'

@Module({
  controllers: [GenreController],
  providers: [GenreService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Genre.name,
        schema: GenreSchema,
      },
    ]),
  ],
})
export class GenreModule {}
