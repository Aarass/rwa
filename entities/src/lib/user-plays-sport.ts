import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from './user';
import { Sport } from './sport';

@Entity()
@Unique(['user', 'sport'])
export class UserPlaysSport {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int', { name: 'userId', nullable: false })
  userId: number;

  @ManyToOne(() => User, (user) => user.sportsIPlay, { nullable: false })
  user: User;

  @Column('int', { name: 'sportId', nullable: false })
  sportId: number;

  @ManyToOne(() => Sport, (sport) => sport.usersPlayingMe, { nullable: false })
  sport: Sport;

  @Column()
  selfRatedSkillLevel: number;
}
