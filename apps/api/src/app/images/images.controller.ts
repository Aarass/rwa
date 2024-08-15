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

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Roles(['admin'])
  @Post('upload/:name')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/',
        filename: (req, file, callback) => {
          const name = req.params['name'];
          if (name != undefined) {
            callback(null, name);
          } else {
            callback(new BadRequestException('No image name provided'), '');
          }
        },
      }),
    })
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {}

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
