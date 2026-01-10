import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Actor } from './schema/actor.schema';
import { Model } from 'mongoose';
import { ActorDto } from './dto/actor.dto';

@Injectable()
export class ActorService {
    constructor(
        @InjectModel(Actor.name) private readonly actorModel: Model<Actor>
    ){}

    
      async getSlug(slug: string) {
        const actor = await this.actorModel.findOne({ slug }).exec()
        
        if(!actor)
          throw new NotFoundException('Актер не найден')
        
        return actor
      }
    
      async getAll(searchTerm?: string) {
        let options = {}
        if (searchTerm) {
          options = {
            $or: [
              {
                name: new RegExp(searchTerm, 'i'),
              },
              {
                slug: new RegExp(searchTerm, 'i'),
              },
            ],
          }
        }
    
        return await this.actorModel
          .find(options)
          .select('-updatedAt -__v')
          .sort({ createdAt: 'desc' })
          .exec()
      }
    
    
      // ************
      //  Admin
      // ************
      async findById(id: string) {
        const actor = await this.actorModel.findById(id)
        if (!actor) throw new NotFoundException('Жанр не найден')
    
        return actor
      }
    
      async update(_id: string, dto: ActorDto) {
        const actor = await this.actorModel
          .findByIdAndUpdate(_id, dto, {
            new: true,
          })
          .exec()
    
        if (!actor) throw new NotFoundException('Жанр не найден')
        return actor
      }
    
      async create() {
        const newactor: ActorDto = {
            name: "",
            slug: "",
            photo: "",
        }
        const actor = await this.actorModel.create(newactor)
        return actor._id
      }
    
      async getcount() {
        return await this.actorModel.find().countDocuments().exec()
      }
    
      async deleteactor(id: string) {
        const actor = await this.actorModel.findByIdAndDelete(id).exec()
        if (!actor) throw new NotFoundException('Жанр не найден')
        return actor
      }
}
