import { Role } from '@rwa/shared';
import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Appointment } from './appointment';
import { Participation } from './participation';
import { Rating } from './rating';
import { UserPlaysSport } from './user-plays-sport';
import { Location } from './location';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  @Exclude()
  passwordHash: string;

  @Column({ type: 'varchar', array: true })
  roles: Role[];

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column()
  phoneNumber: string;

  @Column({ type: 'date' })
  birthDate: string;

  @Column('int', { name: 'locationId', nullable: false })
  locationId: string;

  @ManyToOne(() => Location, (location) => location.users)
  location: Location;

  @Column({ type: 'varchar', nullable: true })
  biography: string | null;

  @Column({ type: 'varchar', nullable: true })
  @Exclude()
  refreshTokenHash: string | null;

  @OneToMany(() => Appointment, (appointment) => appointment.organizer)
  organizedAppointments: Appointment[];

  @OneToMany(() => UserPlaysSport, (ups) => ups.user)
  sportsIPlay: UserPlaysSport[];

  @OneToMany(() => Participation, (participation) => participation.user)
  participations: Participation[];

  @OneToMany(() => Rating, (rating) => rating.userRated)
  usersWhichRatedMe: Rating[];

  @OneToMany(() => Rating, (rating) => rating.userRating)
  usersWhichIRated: Rating[];
}
