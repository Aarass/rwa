import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Appointment } from './appointment';
import { User } from './user';

@Entity()
@Unique(['appointment', 'user'])
export class Participation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: true })
  approved: boolean;

  @Column({ default: true })
  userHasSeenChanges: boolean;

  @Column('int', { name: 'appointmentId', nullable: false })
  appointmentId: number;

  @ManyToOne(() => Appointment, (appointment) => appointment.participants, {
    nullable: false,
  })
  appointment: Appointment;

  @Column('int', { name: 'userId', nullable: false })
  userId: number;

  @ManyToOne(() => User, (user) => user.participations, { nullable: false })
  user: User;
}
