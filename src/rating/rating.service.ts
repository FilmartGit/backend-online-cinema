import { Injectable } from '@nestjs/common'
import { Rating } from './schema/rating.schema'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { MovieService } from 'src/movie/movie.service'
import { SetRatingDto } from './dto/set-rating.dto'

@Injectable()
export class RatingService {
  constructor(
    @InjectModel(Rating.name) private readonly ratingModel: Model<Rating>,
    private readonly movieService: MovieService
  ) {}

  async getMovieValueByUser(movieId: Types.ObjectId, userId: Types.ObjectId) {
    return this.ratingModel
      .findOne({ movieId, userId })
      .select('value')
      .exec()
      .then((data) => (data ? data?.value : 0))
  }

  async averageRatingByMovie(moviesId: Types.ObjectId | string) {
    const ratingMovies: Rating[] = await this.ratingModel
      .aggregate()
      .match({
        movieId: new Types.ObjectId(moviesId),
      })
      .exec()

    if (ratingMovies.length == 0) return 0

    return (
      ratingMovies.reduce((acc, item) => acc + item.value, 0) /
      ratingMovies.length
    )
  }

  async setRating(userId: Types.ObjectId, dto: SetRatingDto) {
    const { movieId, value } = dto
    const newRating = this.ratingModel
      .findOneAndUpdate(
        {
          movieId,
          userId,
        },
        {
          // создадим новую запись, если нет рейтинга у фильма
          movieId,
          userId,
          value,
        },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
        }
      )
      .exec()

    const avarageRating = await this.averageRatingByMovie(movieId)
    await this.movieService.updateRating(movieId, avarageRating)

    return newRating
  }
}
