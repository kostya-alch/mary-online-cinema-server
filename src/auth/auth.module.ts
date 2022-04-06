import { ConfigModule } from '@nestjs/config';
import { UserModel } from './../user/model/user.model';
import { TypegooseModule } from 'nestjs-typegoose';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
   imports: [
      TypegooseModule.forFeature([
         {
            typegooseClass: UserModel,
            schemaOptions: {
               collection: 'User',
            },
         },
      ]),
      ConfigModule,
   ],
   providers: [AuthService],
   controllers: [AuthController],
})
export class AuthModule {}
