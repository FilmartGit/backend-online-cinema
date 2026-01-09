import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Genre } from './schema/genre.schema'
import { CreateGenreDto } from './dto/createGenre.dto'

@Injectable()
export class GenreService {
  constructor(
    @InjectModel(Genre.name) private readonly genreModel: Model<Genre>
  ) {}


  async getSlug(slug: string) {
    const genre = await this.genreModel.findOne({ slug }).exec()
    
    if(!genre)
      throw new NotFoundException('Жанр не найден')
    
    return genre
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
          {
            description: new RegExp(searchTerm, 'i'),
          },
        ],
      }
    }

    return await this.genreModel
      .find(options)
      .select('-updatedAt -__v')
      .sort({ createdAt: 'desc' })
      .exec()
  }

  async getCollections(){
    const genre = await this.getAll()
    const collections = []
    return collections 
  }

  // ************
  //  Admin
  // ************
  async findById(id: string) {
    const genre = await this.genreModel.findById(id)
    if (!genre) throw new NotFoundException('Жанр не найден')

    return genre
  }

  async update(_id: string, dto: CreateGenreDto) {
    const genre = await this.genreModel
      .findByIdAndUpdate(_id, dto, {
        new: true,
      })
      .exec()

    if (!genre) throw new NotFoundException('Жанр не найден')
    return genre
  }

  async create() {
    const newGenre: CreateGenreDto = {
        name: "",
        slug: "",
        description: "",
        icon: "",
    }
    const genre = await this.genreModel.create(newGenre)
    return genre._id
  }

  async getcount() {
    return await this.genreModel.find().countDocuments().exec()
  }

  async deleteGenre(id: string) {
    const genre = await this.genreModel.findByIdAndDelete(id).exec()
    if (!genre) throw new NotFoundException('Жанр не найден')
    return genre
  }
}
