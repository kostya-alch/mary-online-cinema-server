import { CreateGenreDto } from './dto/createGenreDto';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { GenreModel } from './model/genre.model';

@Injectable()
export class GenreService {
   constructor(
      @InjectModel(GenreModel)
      private readonly GenreModel: ModelType<GenreModel>
   ) {}

   async bySlug(slug: string) {
      return this.GenreModel.findOne({ slug }).exec();
   }

   // ищем жанр по его id
   async byId(_id: string) {
      const genre = await this.GenreModel.findById(_id);
      if (!genre) throw new NotFoundException('Genre not found');
      return genre;
   }

   async getAll(searchTerm?: string) {
      let options = {};

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
         };
      }
      return this.GenreModel.find(options)
         .select('-updatedAt -__v')
         .sort({
            createdAt: 'desc',
         })
         .exec();
   }

   async getCount() {
      return this.GenreModel.count().exec();
   }

   // функция создания жанра. она будет отдаваться пустая на клиент, и уже там будем её редактировать
   async create() {
      const defaultValue: CreateGenreDto = {
         name: '',
         slug: '',
         description: '',
         icon: '',
      };
      const genre = await this.GenreModel.create(defaultValue);
      return genre._id;
   }

   // коллекции для вкладки каталог. пока что функция-заглушка
   async getCollection() {
      const genres = await this.getAll();
      const collections = genres;
      return collections;
   }

   // функция обновления жанра фильма
   async update(_id: string, dto: CreateGenreDto) {
      const updateDoc = await this.GenreModel.findByIdAndUpdate(_id, dto, {
         new: true,
      }).exec();

      if (!updateDoc) throw new NotFoundException('Genre not found!!');
      return updateDoc;
   }

   async delete(id: string) {
      const deleteDoc = await this.GenreModel.findByIdAndDelete(id).exec();
      if (!deleteDoc) throw new NotFoundException('Genre not found!!');
      return deleteDoc;
   }
}
