import { GenreModel } from '../../genre/model/genre.model';
import { prop, Ref } from '@typegoose/typegoose';
import { TimeStamps, Base } from '@typegoose/typegoose/lib/defaultClasses';
import { ActorModel } from 'src/actor/model/actor.model';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface MovieModel extends Base {}

export class Parameter {
   @prop()
   year: number;

   @prop()
   duration: number;

   @prop()
   country: string;
}

export class MovieModel extends TimeStamps {
   @prop()
   poster: string;

   @prop()
   bigPoster: string;

   @prop({ unique: true })
   title: string;

   @prop()
   parameters: Parameter;

   @prop({ default: 4.0 })
   rating?: number;

   @prop({ ref: () => GenreModel })
   genres: Ref<GenreModel>[];

   @prop({ default: 0 })
   countOpened?: number;

   @prop({ unique: true })
   videoUrl: string;

   @prop({ ref: () => ActorModel })
   actors: Ref<ActorModel>[];

   @prop({ unique: true })
   slug: string;

   @prop({ default: false })
   isSendTelegram?: boolean;
}
