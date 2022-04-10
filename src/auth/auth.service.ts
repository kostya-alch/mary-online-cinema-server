import { RefreshTokenDto } from './dto/refreshToken.dto';
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
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
   constructor(
      @InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>,
      private readonly jwtService: JwtService
   ) {}

   async login({ email, password }: AuthDto) {
      const user = await this.validateUser(email, password);

      const tokens = await this.issueTokenPair(String(user._id));

      return {
         user: this.returnUserFields(user),
         ...tokens,
      };
   }

   async getNewTokens({ refreshToken }: RefreshTokenDto) {
      // логика для обновления токена
      if (!refreshToken) {
         throw new UnauthorizedException('Please, sign in!');
      }
      const result = await this.jwtService.verifyAsync(refreshToken); // проверка наш или не наш токен
      if (!result) {
         throw new UnauthorizedException('Invalid token or expired!');
      }
      const user = await this.UserModel.findById(result._id);

      const tokens = await this.issueTokenPair(String(user._id));
      return {
         user: this.returnUserFields(user),
         ...tokens,
      };
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

      const user = await newUser.save();
      const tokens = await this.issueTokenPair(String(user._id));

      return {
         user: this.returnUserFields(user),
         ...tokens,
      };
   }

   async findByEmail(email: string) {
      return this.UserModel.findOne({ email }).exec();
   }

   async validateUser(email: string, password: string): Promise<UserModel> {
      const user = await this.findByEmail(email);
      if (!user) throw new UnauthorizedException('User not found');

      const isValidPassword = await compare(password, user.password);
      if (!isValidPassword) throw new UnauthorizedException('Invalid password');

      return user;
   }

   // функция для создания времени пары токенов  - самого токена и его обновления
   async issueTokenPair(userId: string) {
      const data = { _id: userId };

      const refreshToken = await this.jwtService.signAsync(data, {
         expiresIn: '15d', // обновлять токен надо через каждые 15 дней
      });

      const accessToken = await this.jwtService.signAsync(data, {
         expiresIn: '1h', // а вот токен доступа чем чаще - тем лучше)
      });

      return { refreshToken, accessToken };
   }

   returnUserFields(user: UserModel) {
      // функция с полями юзера
      return {
         _id: user._id,
         email: user.email,
         isAdmin: user.isAdmin,
      };
   }
}
