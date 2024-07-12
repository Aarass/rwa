import { DataSourceOptions } from 'typeorm';
import { User } from './src/app/models/user';
import { Appointment } from './src/app/models/appointment';
import { Sport } from './src/app/models/sport';
import { UserPlaysSport } from './src/app/models/user-plays-sport';
import { Participation } from './src/app/models/participation';
import { Rating } from './src/app/models/rating';
import { Surface } from './src/app/models/surface';

export const typeOrmConfig: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  port: 5432,
  entities: [User, Appointment, Sport, UserPlaysSport, Participation, Rating, Surface],
  synchronize: true,
};
