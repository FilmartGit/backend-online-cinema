import { IsArray, IsBoolean, IsNumber, IsObject, IsString } from 'class-validator';
import { Actor } from 'src/actor/schema/actor.schema';
import { Genre } from 'src/genre/schema/genre.schema';

export class Parameters {
    @IsNumber()
    year: number
    @IsNumber()
    duration: number
    @IsString()
    country: string
}

export class CreateMovieDto {
    @IsString()
    poster: string
    @IsString()
    bigPoster: string
    @IsString()
    title: string
    @IsString()
    description: string
    parameters?: Parameters
    @IsString()
    slug: string
    @IsString()
    videoUrl: string
    @IsArray()
    @IsString({ each: true })
    genres: Genre[]
    @IsArray()
    @IsString({ each: true })
    actors: Actor[]
    isSendTelegram?: boolean
}

