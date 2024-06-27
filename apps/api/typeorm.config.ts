import { DataSourceOptions } from 'typeorm';
import { User } from './src/app/user/interfaces/user';

export const typeOrmConfig: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'password',
  database: 'rwa',
  entities: [User],
  synchronize: true,
};
