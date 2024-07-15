import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Appointment } from "./appointment";

@Entity()
export class Surface {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Appointment, (appointment) => appointment.surface)
  appointments: Appointment[];
}
