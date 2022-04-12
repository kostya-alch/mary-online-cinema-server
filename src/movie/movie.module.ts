import { MovieModel } from './../../dist/movie/model/movie.model.d';
import { TypegooseModule } from 'nestjs-typegoose';
import { Module } from '@nestjs/common';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';

@Module({
   imports: [
      TypegooseModule.forFeature([
         {
            typegooseClass: MovieModel,
            schemaOptions: {
               collection: 'Movie',
            },
         },
      ]),
   ],
   controllers: [MovieController],
   providers: [MovieService],
})
export class MovieModule {}
