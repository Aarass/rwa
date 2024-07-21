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
import { JwtAuthGuard } from './guards/jwt.guard';
import { ExtractUser } from './decorators/user.decorator';
import { User } from '../../entities/user';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  @HttpCode(200)
  async register(
    @Body(new ZodValidationPipe(createUserSchema)) newUser: CreateUserDto
  ) {
    await this.authService.register(newUser);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  async login(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken } = await this.authService.login(
      req.user
    );

    res.cookie('refresh_token', refreshToken, {
      secure: true,
      httpOnly: true,
    });

    return { accessToken };
  }

  @Public()
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

    return { accessToken: newAccessToken };
  }

  @Public()
  @Post('logout')
  @HttpCode(200)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies['refresh_token'];
    await this.authService.logout(refreshToken);

    res.cookie('refresh_token', null, {
      secure: true,
      httpOnly: true,
    });
  }

  @Post('test')
  @HttpCode(200)
  test(@ExtractUser() user: User) {
    return user;
  }
}
