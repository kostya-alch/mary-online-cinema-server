import { MovieModel } from './../../movie/model/movie.model';
import { prop, Ref } from '@typegoose/typegoose';
import { TimeStamps, Base } from '@typegoose/typegoose/lib/defaultClasses';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UserModel extends Base {}

export class UserModel extends TimeStamps {
   @prop({ unique: true })
   email: string;

   @prop()
   password: string;

   @prop({ default: false })
   isAdmin?: boolean;

   @prop({ default: [], ref: () => MovieModel })
   favourites?: Ref<MovieModel>[];
}
