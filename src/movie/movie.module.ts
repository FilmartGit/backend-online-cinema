import { Module } from '@nestjs/common'
import { MovieController } from './movie.controller'
import { MovieService } from './movie.service'
import { MongooseModule } from '@nestjs/mongoose'
import { Movie, MovieSchema } from './schema/movie.schema'
import { Actor, ActorSchema } from 'src/actor/schema/actor.schema'
import { Genre, GenreSchema } from 'src/genre/schema/genre.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Movie.name,
        schema: MovieSchema,
      },
      {
        name: Actor.name,
        schema: ActorSchema,
      },
      {
        name: Genre.name,
        schema: GenreSchema,
      },
    ]),
  ],
  controllers: [MovieController],
  providers: [MovieService],
  exports: [MovieService],
})
export class MovieModule {}
