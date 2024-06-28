import {
  Body,
  Controller,
  HttpCode,
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
  @HttpCode(200)
  async login(@Req() req, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken } = await this.authService.login(
      req.user
    );

    res.cookie('refresh_token', refreshToken, {
      secure: true,
      httpOnly: true,
    });

    return accessToken;
  }

  @Post('refresh')
  @HttpCode(200)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const refreshToken = req.cookies['refresh_token'];
    const { newAccessToken, newRefreshToken } = await this.authService.refresh(
      refreshToken
    );

    res.cookie('refresh_token', newRefreshToken, {
      secure: true,
      httpOnly: true,
    });

    return newAccessToken;
  }

  @Post('logout')
  @HttpCode(200)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies['refresh_token'];
    this.authService.logout(refreshToken);

    res.cookie('refresh_token', null, {
      secure: true,
      httpOnly: true,
    });
  }

  @Post('register')
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(createUserSchema))
  async register(@Body() newUser: CreateUserDto) {
    return await this.authService.register(newUser);
  }
}
