import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Participation } from './participation';
import { Surface } from './surface';
import { User } from './user';
import { Sport } from './sport';
import { Location } from './location';

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int', { name: 'locationId', nullable: false })
  locationId: string;

  @ManyToOne(() => Location, (location) => location.appointments)
  location: Location;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'interval' })
  duration: string;

  @Column()
  totalPlayers: number;

  @Column()
  missingPlayers: number;

  @Column()
  minSkillLevel: number;

  @Column()
  maxSkillLevel: number;

  @Column()
  minAge: number;

  @Column()
  maxAge: number;

  @Column()
  pricePerPlayer: number;

  @Column()
  additionalInformation: string;

  @Column({ default: false })
  canceled: boolean;

  @Column('int', { name: 'sportId', nullable: false })
  sportId: number;

  @ManyToOne(() => Surface, { nullable: false })
  sport: Sport;

  @Column('int', { name: 'surfaceId', nullable: false })
  surfaceId: number;

  @ManyToOne(() => Surface, { nullable: false })
  surface: Surface;

  @Column('int', { name: 'organizerId', nullable: false })
  organizerId: number;

  @ManyToOne(() => User, (user) => user.organizedAppointments, {
    nullable: false,
  })
  organizer: User;

  @OneToMany(() => Participation, (participation) => participation.appointment)
  participants: Participation[];
}

export interface AppointmentDto extends Appointment {}
