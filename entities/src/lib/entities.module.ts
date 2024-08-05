import { Module } from '@nestjs/common';
import { Appointment } from './appointment';
import { Location } from './location';
import { Participation } from './participation';
import { Rating } from './rating';
import { Sport } from './sport';
import { Surface } from './surface';
import { User } from './user';
import { UserPlaysSport } from './user-plays-sport';

@Module({
  exports: [
    Appointment,
    Location,
    Participation,
    Rating,
    Sport,
    Surface,
    User,
    UserPlaysSport,
  ],
})
export class EntitiesModule {}

export {
  Appointment,
  Location,
  Participation,
  Rating,
  Sport,
  Surface,
  User,
  UserPlaysSport,
};
