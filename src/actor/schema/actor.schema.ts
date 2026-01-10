import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

@Schema({ timestamps: true })
export class Actor extends Document {
  @Prop({ unique: true })
  slug: string
  @Prop()
  name: string
  @Prop()
  photo: string
}

export const ActorSchema = SchemaFactory.createForClass(Actor)
