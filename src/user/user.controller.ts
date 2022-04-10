import { IdValidationPipe } from './../pipes/idValidationPipe';
import { UpdateUserDto } from './dto/UpdateUserDto';
import { Auth } from './../auth/decorators/auth.decorator';
import { UserService } from './user.service';
import {
   Body,
   Controller,
   Delete,
   Get,
   HttpCode,
   Param,
   Put,
   Query,
   UsePipes,
   ValidationPipe,
} from '@nestjs/common';
import { User } from './decorators/user.decorator';

@Controller('users')
export class UserController {
   constructor(private readonly userService: UserService) {}

   @Get('profile')
   @Auth('admin')
   async getProfile(@User('_id') _id: string) {
      return this.userService.byId(_id);
   }

   @UsePipes(new ValidationPipe())
   @Put('profile')
   @HttpCode(200)
   @Auth()
   async updateProfile(@User('_id') _id: string, @Body() dto: UpdateUserDto) {
      return this.userService.updateProfile(_id, dto);
   }

   @UsePipes(new ValidationPipe())
   @Put(':id')
   @HttpCode(200)
   @Auth('admin')
   async updateUser(
      @Param('_id', IdValidationPipe) _id: string,
      @Body() dto: UpdateUserDto
   ) {
      return this.userService.updateProfile(_id, dto);
   }

   @Get('count')
   @Auth('admin')
   async getCountUsers() {
      return this.userService.getCount();
   }

   @Get()
   @Auth('admin')
   async getUsers(@Query('searchTerm') searchTerm?: string) {
      return this.userService.getAll(searchTerm);
   }

   @Get(':id')
   @Auth('admin')
   async getUser(@User('id', IdValidationPipe) id: string) {
      return this.userService.byId(id);
   }

   @Delete(':id')
   @HttpCode(200)
   @Auth('admin')
   async deleteUser(@Param('id', IdValidationPipe) id: string) {
      return this.userService.delete(id);
   }
}
