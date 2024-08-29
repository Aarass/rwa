import {
  BadRequestException,
  Controller,
  Delete,
  FileTypeValidator,
  FileValidator,
  Get,
  InternalServerErrorException,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Res,
  UnauthorizedException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImagesService } from './images.service';
import { diskStorage, Multer } from 'multer';
import { Response } from 'express';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { v4 as uuidv4 } from 'uuid';
import { AccessTokenPayload, UserDto } from '@rwa/shared';
import { ExtractUser } from '../auth/decorators/user.decorator';
import { User } from '@rwa/entities';
import { UserService } from '../user/user.service';

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
    @ExtractUser() user: User
  ) {
    if (!user.roles.includes('admin')) {
      this.userService.setUserProfileImage(user.id, file.filename);
    }
    return { name: file.filename };
  }

  @Public()
  @Get(':name')
  getImage(@Param('name') name: string, @Res() res: Response) {
    return res.sendFile(name, { root: './uploads' });
  }

  @Public()
  @Get()
  getNames() {
    return this.imagesService.getNames();
  }

  @Delete(':name')
  remove(@ExtractUser() user: User, @Param('name') name: string) {
    if (!user.roles.includes('admin') && name != `user_${user.id}`) {
      return new UnauthorizedException();
    }

    if (!user.roles.includes('admin')) {
      this.userService.setUserProfileImage(user.id, null);
    }

    return this.imagesService.remove(name);
  }
}
