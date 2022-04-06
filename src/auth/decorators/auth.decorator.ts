import { OnlyAdminGuard } from './../guards/admin.guard';
import { applyDecorators, UseGuards } from '@nestjs/common';
import { jwtAuthGuard } from '../guards/jwt.guard';
import { TypeRoll } from './../interface/auth.interface';

// кастомный декоратор для определения роли пользователя
export const Auth = (role: TypeRoll = 'user') =>
   applyDecorators(
      role === 'admin'
         ? UseGuards(jwtAuthGuard, OnlyAdminGuard)
         : UseGuards(jwtAuthGuard)
   );
