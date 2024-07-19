import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Appointment } from './appointment';
import { User } from './user';

@Entity()
export class Participation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  approved: boolean;

  @Column()
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
