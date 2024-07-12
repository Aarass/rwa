import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user';
import { Participation } from './participation';
import { Surface } from './surface';

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

  @Column()
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
  additionalInformation: string;

  @Column()
  pricePerPlayer: number;

  @Column('int', { name: 'surfaceId', nullable: false })
  surfaceId: number;

  @ManyToOne(() => Surface, { nullable: false })
  surface: Surface;

  @Column('int', { name: 'organizerId', nullable: false })
  organizerId: number;

  @ManyToOne(() => User, (user) => user.organizedAppointments, { nullable: false })
  organizer: User;

  @OneToMany(() => Participation, (participation) => participation.appointment)
  participants: Participation[];
}
