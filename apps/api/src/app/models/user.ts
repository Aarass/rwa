import { Exclude } from 'class-transformer';
import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Appointment } from './appointment';
import { UserPlaysSport } from './user-plays-sport';
import { Participation } from './participation';
import { Rating } from './rating';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  @Exclude()
  passwordHash: string;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column()
  phoneNumber: string;

  @Column({ type: 'date' })
  birthDate: string;

  // TODO
  @Column()
  city: string

  @Column({ nullable: true })
  biography: string;

  @Column({ nullable: true })
  @Exclude()
  refreshTokenHash: string;

  @OneToMany(() => Appointment, (appointment) => appointment.organizer)
  organizedAppointments: Appointment[];

  @OneToMany(() => UserPlaysSport, (ups) => ups.user)
  sportsIPlay: UserPlaysSport[];

  @OneToMany(() => Participation, (participation) => participation.user)
  participations: Participation[]

  @OneToMany(() => Rating, (rating) => rating.userRated)
  usersWhichRatedMe: Rating[];

  @OneToMany(() => Rating, (rating) => rating.userRating)
  usersWhichIRated: Rating[];
}
