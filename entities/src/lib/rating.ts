import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from './user';

@Entity()
@Unique(['userRated', 'userRating'])
export class Rating {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.usersWhichRatedMe, { nullable: false })
  userRated: User;

  @ManyToOne(() => User, (user) => user.usersWhichIRated, { nullable: false })
  userRating: User;

  @Column()
  value: number;
}
