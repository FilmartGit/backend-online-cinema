import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Schema as MongooseSchema } from 'mongoose'
import { Actor } from 'src/actor/schema/actor.schema'
import { Genre } from 'src/genre/schema/genre.schema'

export class Parameters {
  @Prop()
  year: number
  @Prop()
  duration: number
  @Prop()
  country: string
}

@Schema({ timestamps: true })
export class Movie extends Document {
  @Prop()
  poster: string
  @Prop()
  bigPoster: string
  @Prop()
  title: string
  @Prop()
  description: string
  @Prop()
  parameters?: Parameters
  @Prop({ unique: true })
  slug: string
  @Prop({ default: 4.0 })
  rating: number
  @Prop({ default: 0 })
  countOpened: number
  @Prop()
  videoUrl: string
  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: Genre.name }] })
  genres: Genre[]
   @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: Actor.name }] })
  actors: Actor[]
  @Prop({ default: false })
  isSendTelegram?: boolean
}

export const MovieSchema = SchemaFactory.createForClass(Movie)
