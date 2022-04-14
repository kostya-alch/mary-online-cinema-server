import { SetRatingDto } from './dto/setRatingDto';
import { Types } from 'mongoose';
import { IdValidationPipe } from './../pipes/idValidationPipe';
import { User } from './../user/decorators/user.decorator';
import { Auth } from 'src/auth/decorators/Auth.decorator';
import { RatingService } from './rating.service';
import {
   Body,
   Controller,
   Get,
   HttpCode,
   Param,
   Post,
   UsePipes,
   ValidationPipe,
} from '@nestjs/common';

@Controller('ratings')
export class RatingController {
   constructor(private readonly ratingService: RatingService) {}

   @Get(':movieId')
   @Auth()
   async getMovieValueByUser(
      @Param('movieId', IdValidationPipe) movieId: Types.ObjectId,
      @User('_id') _id: Types.ObjectId
   ) {
      return this.ratingService.getMovieValueByUser(movieId, _id);
   }

   @UsePipes(new ValidationPipe())
   @Post('set-rating')
   @HttpCode(200)
   @Auth()
   async setRating(
      @User('_id') _id: Types.ObjectId,
      @Body() dto: SetRatingDto
   ) {
      return this.ratingService.setRating(_id, dto);
   }
}
