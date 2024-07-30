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
} from '@nestjs/common';
import { CreateUserDto, createUserSchema } from '@rwa/shared';
import { ExtractUser } from '../auth/decorators/user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { ZodValidationPipe } from '../global/validation';
import { UserService } from './user.service';
import { User } from '@rwa/shared';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Public()
  @Get('')
  async getUsers() {
    return await this.userService.getAllUsers();
  }

  @Get('me')
  async getMe(@ExtractUser() user: User) {
    return await this.userService.getUserById(user.id);
  }

  @Public()
  @Get(':id')
  async getUser(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.getUserById(id);
  }

  @Roles(['admin'])
  @Post()
  async createUser(
    @Body(new ZodValidationPipe(createUserSchema)) newUser: CreateUserDto
  ) {
    return await this.userService.createUser(newUser);
  }

  @Delete(':id')
  async deleteUser(
    @ExtractUser() user: User,
    @Param('id', ParseIntPipe) id: number
  ) {
    if (!user.roles.includes('admin') && id != user.id) {
      throw new UnauthorizedException(
        `User can't delete other users, u must be admin`
      );
    }
    return await this.userService.deleteUserById(id);
  }
}
