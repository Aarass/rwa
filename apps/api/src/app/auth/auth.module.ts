import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/interfaces/user';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({ secret: process.env.JWT_SECRET }),
  ],
  providers: [UserService, AuthService],
})
export class AuthModule {}
