import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';

@Module({
  controllers: [ImagesController],
  imports: [UserModule],
  providers: [ImagesService],
  exports: [ImagesService],
})
export class ImagesModule {}
