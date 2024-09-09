import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserPlaysSport } from './user-plays-sport';
import { Appointment } from './appointment';

@Entity()
export class Sport {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  imageName: string;

  @OneToMany(() => UserPlaysSport, (ups) => ups.sport)
  usersPlayingMe: UserPlaysSport[];

  @OneToMany(() => Appointment, (appointment) => appointment.sport)
  appointments: Appointment[];
}
