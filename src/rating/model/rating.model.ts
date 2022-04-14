import { UserModel } from '../../user/model/user.model';
import { prop, Ref } from '@typegoose/typegoose';
import { TimeStamps, Base } from '@typegoose/typegoose/lib/defaultClasses';
import { MovieModel } from '../../movie/model/movie.model';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface RatingModel extends Base {}

export class RatingModel extends TimeStamps {
   @prop({ ref: () => UserModel })
   userId: Ref<UserModel>[];

   @prop({ ref: () => MovieModel })
   movieId?: Ref<MovieModel>[];

   @prop()
   value: number;
}
