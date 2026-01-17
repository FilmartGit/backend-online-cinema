import { Module } from '@nestjs/common'
import { RatingService } from './rating.service'
import { RatingController } from './rating.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Rating, RatingSchema } from './schema/rating.schema'
import { MovieModule } from 'src/movie/movie.module'
import { MovieService } from 'src/movie/movie.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Rating.name,
        schema: RatingSchema,
      },
    ]),
    MovieModule,
  ],
  providers: [RatingService],
  controllers: [RatingController],
})
export class RatingModule {}
