import { UpdateUserDto } from './dto/UpdateUserDto';
import { ModelType, DocumentType } from '@typegoose/typegoose/lib/types';
import { UserModel } from './model/user.model';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { genSalt, hash } from 'bcryptjs';
import { Types } from 'mongoose';

@Injectable()
export class UserService {
   constructor(
      @InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>
   ) {}

   // ищем юзера по его id
   async byId(_id: string) {
      const user = await this.UserModel.findById(_id);
      if (!user) throw new NotFoundException('User not found');
      return user;
   }

   // функция обновления профиля обычного юзера
   async updateProfile(_id: string, dto: UpdateUserDto) {
      const user = await this.byId(_id);
      const isSameUser = await this.UserModel.findOne({ email: dto.email });

      if (isSameUser && String(_id) !== String(isSameUser._id)) {
         throw new NotFoundException('Email busy');
      }

      if (dto.password) {
         const saltPassword = await genSalt(10);
         user.password = await hash(dto.password, saltPassword);
      }

      user.email = dto.email;
      if (dto.isAdmin || dto.isAdmin === false) {
         user.isAdmin = dto.isAdmin;
      }
      await user.save();
      return;
   }

   async getCount() {
      return this.UserModel.count().exec();
   }

   async getAll(searchTerm?: string) {
      let options = {};

      if (searchTerm) {
         options = {
            $or: [
               {
                  email: new RegExp(searchTerm, 'i'),
               },
            ],
         };
      }
      return this.UserModel.find(options)
         .select('-password -updatedAt -__v')
         .sort({
            createdAt: 'desc',
         })
         .exec();
   }

   async delete(id: string): Promise<DocumentType<UserModel> | null> {
      return this.UserModel.findByIdAndDelete(id).exec();
   }

   async toggleFavourites(movieId: Types.ObjectId, user: UserModel) {
      const { _id, favourites } = user;

      await this.UserModel.findByIdAndUpdate(_id, {
         favorites: favourites.includes(movieId)
            ? favourites.filter((id) => String(id) !== String(movieId))
            : [...favourites, movieId],
      });
   }

   async getFavouriteMovies(_id: Types.ObjectId) {
      return this.UserModel.findById(_id, 'favourites')
         .populate({ path: 'favourites', populate: { path: 'genres' } })
         .exec()
         .then((data) => data.favourites);
   }
}
