import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class ImagesService {
  getNames() {
    return fs.readdirSync('./uploads');
  }

  exists(name: string) {
    return fs.existsSync(`./uploads/${name}`);
  }

  remove(name: string) {
    try {
      fs.rmSync(`./uploads/${name}`);
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
        throw new NotFoundException();
      } else {
        console.error(err);
        throw new BadRequestException();
      }
    }
  }
}
