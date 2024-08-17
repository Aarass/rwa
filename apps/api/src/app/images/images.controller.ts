import {
  BadRequestException,
  Controller,
  Delete,
  FileTypeValidator,
  FileValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Res,
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

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Roles(['admin'])
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/',
        filename: (req, file, callback) => {
          const segments = file.originalname.split('.');
          if (segments.length < 2) {
            callback(new BadRequestException('Invalid image name'), '');
          } else {
            callback(null, uuidv4().concat('.', segments[segments.length - 1]));
          }
        },
      }),
    })
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
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

  @Roles(['admin'])
  @Delete(':name')
  remove(@Param('name') name: string) {
    return this.imagesService.remove(name);
  }
}
