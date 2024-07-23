import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Appointment } from './appointment';
import { User } from './user';

@Entity()
export class Location {
  // Ovo je id koji koristi google
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column({ type: 'numeric' })
  lat: number;

  @Column({ type: 'numeric' })
  lng: number;

  @OneToMany(() => Appointment, (appointment) => appointment.location)
  appointments: Appointment[];

  @OneToMany(() => User, (user) => user.location)
  users: User[];
}
