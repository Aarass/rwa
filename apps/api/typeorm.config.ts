import { DataSourceOptions } from 'typeorm';
import { User } from './src/app/user/models/user';

export const typeOrmConfig: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  port: 5432,
  entities: [User],
  synchronize: true,
};
