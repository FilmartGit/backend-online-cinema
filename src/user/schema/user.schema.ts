import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import { Document } from 'mongoose'

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

  @Prop({ default: [] })
  favorites?: string[]
}

export const UserSchema = SchemaFactory.createForClass(User)
