import { BadRequestException, Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class ImagesService {
  getNames() {
    return fs.readdirSync('./uploads');
  }

  remove(name: string) {
    try {
      fs.rmSync(`./uploads/${name}`);
    } catch (err) {
      console.error(err);
      throw new BadRequestException();
    }
  }
}
