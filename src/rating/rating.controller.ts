import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { RatingService } from './rating.service'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { SetRatingDto } from './dto/set-rating.dto'
import { Types } from 'mongoose'
import { UserDecor } from 'src/user/decorators/user.decorator'
import { IdValidationPipe } from 'src/pipes/id.validation.pipe'

@Controller('ratings')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Get(':movieId')
  @Auth()
  async getMovieValueByUser(
    @Param('movieId', IdValidationPipe) movieId: Types.ObjectId,
    @UserDecor('_id') id: Types.ObjectId
  ) {
    return await this.ratingService.getMovieValueByUser(movieId, id)
  }

  @UsePipes(new ValidationPipe())
  @Post('set-rating')
  @Auth()
  @HttpCode(200)
  async setRating(
    @UserDecor('_id') id: Types.ObjectId,
    @Body() dto: SetRatingDto
  ) {
    return await this.ratingService.setRating(id, dto)
  }
}
