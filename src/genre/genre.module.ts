import { MovieModule } from 'src/movie/movie.module';
import { TypegooseModule } from 'nestjs-typegoose';
import { Module } from '@nestjs/common';
import { GenreController } from './genre.controller';
import { GenreService } from './genre.service';
import { GenreModel } from './model/genre.model';

@Module({
   imports: [
      TypegooseModule.forFeature([
         {
            typegooseClass: GenreModel,
            schemaOptions: {
               collection: 'Genre',
            },
         },
      ]),
      MovieModule,
   ],
   controllers: [GenreController],
   providers: [GenreService],
})
export class GenreModule {}
