import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Schema as MongooseSchema, Types } from 'mongoose'
import { Movie } from 'src/movie/schema/movie.schema'


@Schema({ timestamps: true })
export class User extends Document {

  @Prop({ unique: true })
  email: string

  @Prop()
  name: string
  
  @Prop()
  password: string

  @Prop({ default: false })
  isAdmin?: boolean

  @Prop({ default: [], type: [{ type: MongooseSchema.Types.ObjectId, ref: Movie.name }] })
  favorites?: Types.ObjectId[]
}

export const UserSchema = SchemaFactory.createForClass(User)
