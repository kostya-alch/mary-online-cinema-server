import { ConfigModule } from '@nestjs/config';
import { UserModel } from 'src/user/model/user.model';
import { TypegooseModule } from 'nestjs-typegoose';
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';

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
   providers: [UserService],
   controllers: [UserController],
})
export class UserModule {}
