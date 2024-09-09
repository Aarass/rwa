import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Res,
  UnauthorizedException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AccessTokenPayload, TokenUser } from '@rwa/shared';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { Public } from '../auth/decorators/public.decorator';
import { ExtractUser } from '../auth/decorators/user.decorator';
import { UserService } from '../user/user.service';
import { ImagesService } from './images.service';

@Controller('images')
export class ImagesController {
  constructor(
    private readonly imagesService: ImagesService,
    private userService: UserService
  ) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/',
        filename: (req, file, callback) => {
          if (req.user == undefined) {
            callback(new InternalServerErrorException(), '');
            return;
          }

          const { user } = {
            user: req.user,
            iat: 0,
            exp: 0,
          } as AccessTokenPayload;

          const segments = file.originalname.split('.');
          if (segments.length < 2) {
            callback(new BadRequestException('Invalid image name'), '');
          } else {
            if (user.roles.includes('admin')) {
              callback(
                null,
                uuidv4().concat('.', segments[segments.length - 1])
              );
            } else {
              callback(null, `user_${user.id}`);
            }
          }
        },
      }),
    })
  )
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @ExtractUser() user: TokenUser
  ) {
    if (!user.roles.includes('admin')) {
      this.userService.setUserProfileImage(user.id, file.filename);
    }
    return { name: file.filename };
  }

  @Public()
  @Get(':name')
  getImage(@Param('name') name: string, @Res() res: Response) {
    return res.sendFile(name, { root: './uploads' }, (err?) => {
      if (err) {
        if (!res.headersSent) {
          if ((err as any).code === 'ENOENT') {
            res.statusCode = 404;
            res.send({
              statusCode: 404,
              message: err.message,
            });
          } else {
            res.sendStatus(500);
          }
        }
      }
    });
  }

  @Public()
  @Get()
  getNames() {
    return this.imagesService.getNames();
  }

  @Delete(':name')
  remove(@ExtractUser() user: TokenUser, @Param('name') name: string) {
    if (!user.roles.includes('admin') && name != `user_${user.id}`) {
      return new UnauthorizedException();
    }

    if (!user.roles.includes('admin')) {
      this.userService.setUserProfileImage(user.id, null);
    }

    return this.imagesService.remove(name);
  }
}
