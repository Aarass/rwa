import { Module } from '@nestjs/common';
import { User } from './user';
import { Sport } from './sport';
import { UserPlaysSport } from './user-plays-sport';
import { Appointment } from './appointment';
import { Participation } from './participation';
import { Surface } from './surface';
import { Rating } from './rating';

@Module({
  exports: [User, Sport, UserPlaysSport, Appointment, Participation, Surface, Rating]
})
export class EntitiesModule { }
