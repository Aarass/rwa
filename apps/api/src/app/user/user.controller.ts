import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { CreateUserDto, createUserSchema } from '@rwa/shared';
import { ExtractUser } from '../auth/decorators/user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { ZodValidationPipe } from '../global/validation';
import { User } from './models/user';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@ExtractUser() user: User) {
    return user;
  }

  @Get()
  getUsers() {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  getUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getUserById(id);
  }

  @Post()
  @UsePipes(new ZodValidationPipe(createUserSchema))
  createUser(@Body() newUser: CreateUserDto) {
    return this.userService.createUser(newUser);
  }

  @Get(':id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deleteUserById(id);
  }
}
