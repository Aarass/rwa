import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserPlaysSport } from "./user-plays-sport";

@Entity()
export class Sport {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  iconUrl: string;

  @OneToMany(() => UserPlaysSport, (ups) => ups.sport)
  usersPlayingMe: UserPlaysSport[]

}
