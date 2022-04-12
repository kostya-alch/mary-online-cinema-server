import { GenreModel } from './../../genre/model/genre.model';
import { prop, Ref } from '@typegoose/typegoose';
import { TimeStamps, Base } from '@typegoose/typegoose/lib/defaultClasses';
import { ActorModel } from 'src/actor/model/actor.model';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface MovieModel extends Base {}

export class Parameters {
   @prop()
   year: number;

   @prop()
   duration: number;

   @prop()
   country: number;
}

export class MovieModel extends TimeStamps {
   @prop()
   poster: string;

   @prop()
   bigPoster: string;

   @prop()
   title: string;

   @prop()
   description: string;

   @prop({ unique: true })
   slug: string;

   @prop({ default: 4.0 })
   rating?: number;

   @prop({ default: 0 })
   countOpened?: number;

   @prop()
   videoUrl: string;

   @prop()
   parameters?: Parameters;

   @prop({ ref: () => GenreModel })
   genres: Ref<GenreModel>[];

   @prop({ ref: () => ActorModel })
   actors: Ref<ActorModel>[];

   @prop({ default: false })
   isSendTelegram?: boolean;
}
