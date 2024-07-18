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

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  // TODO
  @Column()
  location: string;

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
