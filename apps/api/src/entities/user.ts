import { Exclude } from "class-transformer";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Appointment } from "./appointment";
import { Participation } from "./participation";
import { Rating } from "./rating";
import { UserPlaysSport } from "./user-plays-sport";

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
