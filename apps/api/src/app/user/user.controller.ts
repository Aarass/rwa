import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UnauthorizedException,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { CreateUserDto, createUserSchema } from '@rwa/shared';
import { ExtractUser } from '../auth/decorators/user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { ZodValidationPipe } from '../global/validation';
import { UserService } from './user.service';
import { User } from '../models/user';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) { }

  @Get('')
  async getUsers() {
    return await this.userService.getAllUsers();
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@ExtractUser() user: User) {
    return await this.userService.getUserById(user.id);
  }

  @Get(':id')
  async getUser(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.getUserById(id);
  }

  @Post()
  @UsePipes(new ZodValidationPipe(createUserSchema))
  async createUser(@Body() newUser: CreateUserDto) {
    return await this.userService.createUser(newUser);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteUser(@ExtractUser() user: User, @Param('id', ParseIntPipe) id: number) {
    if (id != user.id) {
      throw new UnauthorizedException();
    }
    return await this.userService.deleteUserById(id);
  }
}

