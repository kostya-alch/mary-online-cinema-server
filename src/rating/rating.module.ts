import { TypegooseModule } from 'nestjs-typegoose';
import { Module } from '@nestjs/common';
import { RatingController } from './rating.controller';
import { RatingService } from './rating.service';
import { RatingModel } from './model/rating.model';
import { MovieModule } from '../movie/movie.module';

@Module({
   imports: [
      TypegooseModule.forFeature([
         {
            typegooseClass: RatingModel,
            schemaOptions: {
               collection: 'Rating',
            },
         },
      ]),
      MovieModule,
   ],
   controllers: [RatingController],
   providers: [RatingService],
})
export class RatingModule {}
