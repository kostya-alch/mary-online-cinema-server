import { AuthDto } from './dto/auth.dto';
import {
   BadRequestException,
   Injectable,
   UnauthorizedException,
} from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { UserModel } from 'src/user/model/user.model';
import { genSalt, hash, compare } from 'bcryptjs';

@Injectable()
export class AuthService {
   constructor(
      @InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>
   ) {}

   async login(dto: any) {
      return this.validateUser(dto);
   }

   async register(dto: AuthDto) {
      const oldUser = await this.UserModel.findOne({ email: dto.email }); // ищем конкретного юзера
      if (oldUser) {
         // если не нашли - бросаем ошибку
         throw new BadRequestException(
            'User with this email is already in the system'
         );
      }
      const salt = await genSalt(10); // генерируем соль для хэша пароля
      const newUser = new this.UserModel({
         email: dto.email,
         password: await hash(dto.password, salt),
      }); // и создаем нового в бд
      return newUser.save();
   }

   async validateUser(dto: AuthDto): Promise<UserModel> {
      // функция валидации юзера
      const user = await this.UserModel.findOne({ email: dto.email });
      if (!user) {
         throw new UnauthorizedException('User not found!');
      }
      const isValidPassword = await compare(dto.password, user.password); // compare сверяет пароли
      if (!isValidPassword) {
         throw new UnauthorizedException('Invalid password!');
      }
      return user;
   }
}
