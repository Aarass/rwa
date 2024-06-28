import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
  Req,
  Res,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { CreateUserDto, createUserSchema } from '@rwa/shared';
import { Request, Response } from 'express';
import { ZodValidationPipe } from '../global/validation';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken } = await this.authService.createSession(
      req.user
    );

    res.cookie('refresh_token', refreshToken, {
      secure: true,
      httpOnly: true,
    });

    return accessToken;
  }

  @Post('refresh')
  async refresh(@Req() req: Request) {
    const refreshToken = req.cookies['refresh_token'];
    const { newAccessToken, newRefreshToken } =
      this.authService.refreshSession(refreshToken);
  }

  @Post('register')
  @UsePipes(new ZodValidationPipe(createUserSchema))
  async register(@Body() newUser: CreateUserDto) {
    return await this.authService.register(newUser);
  }

  // @UseGuards(JwtAuthGuard)
  // @Get('profile')
  // getProfile(user: any, @Request() req, @Body() body) {
  //   return {
  //     user: req.user,
  //     body: body,
  //   };
  // }
}
