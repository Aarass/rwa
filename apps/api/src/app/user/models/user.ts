import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
  birthDate: string;

  @Column({ nullable: true })
  @Exclude()
  refreshTokenHash: string;
}
