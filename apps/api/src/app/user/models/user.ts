import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  passwordHash: string;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column({ nullable: true })
  refreshToken: string;
}
