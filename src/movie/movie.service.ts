import { CreateMovieDto } from './dto/createMovie.dto';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { MovieModel } from './../../dist/movie/model/movie.model.d';
import { InjectModel } from 'nestjs-typegoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class MovieService {
   constructor(
      @InjectModel(MovieModel)
      private readonly MovieModel: ModelType<MovieModel>
   ) {}

   // ищем фильм по его slug
   async bySlug(slug: string) {
      const doc = await this.MovieModel.findOne({ slug })
         .populate('actors genres')
         .exec();
      if (!doc) throw new NotFoundException('Movies not found!');
      return doc;
   }

   // ищем фильм по актеру
   async byActor(actorId: string) {
      const doc = await this.MovieModel.find({ actors: actorId }).exec();
      if (!doc) throw new NotFoundException('Movies not found!');
      return doc;
   }

   // ищем фильм по жанру
   async byGenres(genreIds: Types.ObjectId[]) {
      const doc = await this.MovieModel.find({
         genres: { $in: genreIds },
      }).exec();
      if (!doc) throw new NotFoundException('Actor not found!');
      return doc;
   }

   // выводим самый популярный фильм
   async getMostPopular() {
      return this.MovieModel.find({ countOpened: { $gt: 0 } })
         .sort({ countOpened: -1 })
         .populate('genres')
         .exec();
   }

   // обновляем счетчик просмотра фильма
   async updateCountOpened(slug: string) {
      const updateDoc = await this.MovieModel.findOneAndUpdate(
         { slug },
         {
            $inc: { countOpened: 1 },
         }
      ).exec();

      if (!updateDoc) throw new NotFoundException('Genre not found!!');

      return updateDoc;
   }

   // ищем фильм по его id
   async byId(_id: string) {
      const movie = await this.MovieModel.findById(_id);
      if (!movie) throw new NotFoundException('Movie not found');
      return movie;
   }

   // получаем все фильмы по запросу
   async getAll(searchTerm?: string) {
      let options = {};

      if (searchTerm) {
         options = {
            $or: [
               {
                  title: new RegExp(searchTerm, 'i'),
               },
            ],
         };
      }
      return this.MovieModel.find(options)
         .select('-updatedAt -__v')
         .sort({
            createdAt: 'desc',
         })
         .populate('actors genres')
         .exec();
   }

   // кол-во фильмов
   async getCount() {
      return this.MovieModel.count().exec();
   }

   // функция создания фильма. она будет отдаваться пустая на клиент, и уже там будем её редактировать
   async create() {
      const defaultValue: CreateMovieDto = {
         bigPoster: '',
         actors: [],
         genres: [],
         description: '',
         poster: '',
         title: '',
         videoUrl: '',
         slug: '',
      };
      const movie = await this.MovieModel.create(defaultValue);
      return movie._id;
   }

   // функция обновления фильма
   async update(_id: string, dto: CreateMovieDto) {
      // todo telegram

      const updateDoc = await this.MovieModel.findByIdAndUpdate(_id, dto, {
         new: true,
      }).exec();

      if (!updateDoc) throw new NotFoundException('Movies not found!!');
      return updateDoc;
   }

   // удаляем фильм с радаров)
   async delete(id: string) {
      const deleteDoc = await this.MovieModel.findByIdAndDelete(id).exec();
      if (!deleteDoc) throw new NotFoundException('Movies not found!!');
      return deleteDoc;
   }
}
