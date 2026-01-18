import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { Model, Types, UpdateOneModel } from 'mongoose'
import { Movie } from './schema/movie.schema'
import { InjectModel } from '@nestjs/mongoose'
import { title } from 'process'
import { CreateMovieDto } from './dto/createMovie.dto'
import { UpdateCountopenedDto } from './dto/updateCouuntopened.dto'
import { TelegramService } from 'src/telegram/telegram.service'

@Injectable()
export class MovieService {
  constructor(
    @InjectModel(Movie.name) private readonly movieModel: Model<Movie>,
    private readonly telegramService: TelegramService
  ) {}

  async getAll(searchTerm?: string) {
    let options = {}
    if (searchTerm) {
      options = {
        $or: [
          {
            title: new RegExp(searchTerm, 'i'),
          },
        ],
      }
    }

    return await this.movieModel
      .find(options)
      .select('-updatedAt -__v')
      .sort({ createdAt: 'desc' })
      .populate('actors genres')
      .exec()
  }

  async getSlug(slug: string) {
    const movie = await this.movieModel
      .findOne({ slug })
      .populate('actors genres') // Разворачиваем связанные документы и ищем в них
      .exec()
    if (!movie) throw new NotFoundException('Фильм не найден')

    return movie
  }

  async byActor(actorId: Types.ObjectId) {
    if (!Types.ObjectId.isValid(actorId)) {
      throw new BadRequestException('Неверный формат ID актёра')
    }
    const movie = await this.movieModel.find({ actors: actorId } as any).exec()
    if (!movie) throw new NotFoundException('Фильм не найден')

    return movie
  }

  async byGenres(genresIds: Types.ObjectId[]) {
    if (
      !genresIds.every((id) => Types.ObjectId.isValid(id)) ||
      genresIds.length === 0
    ) {
      throw new BadRequestException('Неверный формат ID жанра')
    }
    const movie = await this.movieModel
      .findOne({ genres: { $in: genresIds } as any })
      .exec()
    if (!movie) throw new NotFoundException('Фильм не найден')

    return movie
  }

  async updateCountOpened(dto: UpdateCountopenedDto) {
    const slug = dto.slug
    if (!slug) throw new BadRequestException('Не передан slug')

    const movie = await this.movieModel
      .findOneAndUpdate(
        { slug },
        {
          $inc: { countOpened: 1 },
        },
        {
          new: true,
        }
      )
      .exec()
    if (!movie) throw new NotFoundException('Фильм не найден')

    return movie
  }

  async getMostPopular() {
    return await this.movieModel
      .find({ countOpened: { $gt: 0 } }) // $gt - "больше чем >" // $lt - "меньше чем <"
      .sort({ countOpened: -1 })
      .populate('genres') // Разворачиваем связанные документы и ищем в них
      .exec()
  }

  async updateRating(id: Types.ObjectId, newRating: number) {
    return await this.movieModel
      .findByIdAndUpdate(
        id,
        {
          rating: newRating,
        },
        { new: true }
      )
      .exec()
  }

  // ************
  //  Admin
  // ************
  async findById(id: string) {
    const movie = await this.movieModel.findById(id)
    if (!movie) throw new NotFoundException('Фильм не найден')

    return movie
  }

  async update(_id: string, dto: CreateMovieDto) {

    // Проверка, если фильм не был опубликован в телеграм, то отправляем уведомление
    if (!dto.isSendTelegram) {
      await this.sendNotification(dto)
      dto.isSendTelegram = true
    }

    const movie = await this.movieModel
      .findByIdAndUpdate(_id, dto, {
        new: true,
      })
      .exec()
    if (!movie) throw new NotFoundException('Фильм не найден')

    return movie
  }

  async create() {
    const newmovie: CreateMovieDto = {
      poster: '',
      bigPoster: '',
      title: '',
      description: '',
      slug: '',
      videoUrl: '',
      genres: [],
      actors: [],
    }
    const movie = await this.movieModel.create(newmovie)
    return movie._id
  }

  async getcount() {
    return await this.movieModel.find().countDocuments().exec()
  }

  async deletemovie(id: string) {
    const movie = await this.movieModel.findByIdAndDelete(id).exec()
    if (!movie) throw new NotFoundException('Фильм не найден')
    return movie
  }

  async sendNotification(dto: CreateMovieDto) {
    if (process.env.NODE_ENV === 'production') {
      // await this.telegramService.sendPhoto(dto.poster)
    }
    await this.telegramService.sendPhoto(
      'https://avatars.mds.yandex.net/get-mpic/1554397/img_id6243470463670483560.jpeg/orig'
    )

    const message = `<b>${dto.title}</b>\n\n ${dto.description}\n\n`
    await this.telegramService.sendMessage(message, {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Смотреть',
              url: `${process.env.URL_MOVIE}${dto.slug}`,
            },
          ],
        ],
      },
    })
  }
}
