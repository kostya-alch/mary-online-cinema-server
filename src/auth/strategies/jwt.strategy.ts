import { ModelType } from '@typegoose/typegoose/lib/types';
import { UserModel } from 'src/user/model/user.model';
import { InjectModel } from 'nestjs-typegoose';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';

// вспомогательный класс для инииализации jwt-токена
@Injectable()
export class jwtStrategy extends PassportStrategy(Strategy) {
   constructor(
      private readonly configService: ConfigService,
      @InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>
   ) {
      super({
         // переопределяем конструктор с необходимыми параметрами для токена
         jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
         ignoreExpiration: true,
         secretOrKey: configService.get('JWT_SECRET'),
      });
   }

   // вынес в отдельную функцию валидацию jwt токена
   async validate({ _id }: Pick<UserModel, '_id'>) {
      const user = await this.UserModel.findById(_id);
      return user;
   }
}
