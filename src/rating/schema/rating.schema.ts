import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Schema as MongooseSchema, Types } from 'mongoose'
import { Movie } from 'src/movie/schema/movie.schema'
import { User } from 'src/user/schema/user.schema'

@Schema({ timestamps: true })
export class Rating extends Document {
  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: User.name }],
  })
  userId?: User

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: Movie.name }],
  })
  movieId?: Movie

  @Prop()
  value: number
}

export const RatingSchema = SchemaFactory.createForClass(Rating)
