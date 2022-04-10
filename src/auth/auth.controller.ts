import { RefreshTokenDto } from './dto/refreshToken.dto';
import { AuthDto } from './dto/auth.dto';

import {
   Body,
   Controller,
   HttpCode,
   Post,
   UsePipes,
   ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
   constructor(private readonly authService: AuthService) {}

   @UsePipes(new ValidationPipe()) // валидация полей подключена
   @HttpCode(200) // изначально post-запрос возвращает 201 ответ, а надо вернуть 200 для фронта
   @Post('login')
   async login(@Body() dto: AuthDto) {
      return this.authService.login(dto);
   }

   @UsePipes(new ValidationPipe()) // валидация полей подключена
   @HttpCode(200) // изначально post-запрос возвращает 201 ответ, а надо вернуть 200 для фронта
   @Post('login/access-token')
   async getNewTokens(@Body() dto: RefreshTokenDto) {
      return this.authService.getNewTokens(dto);
   }

   @UsePipes(new ValidationPipe())
   @HttpCode(200)
   @Post('register')
   async register(@Body() dto: AuthDto) {
      return this.authService.register(dto);
   }
}
