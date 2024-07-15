import { DataSourceOptions } from 'typeorm';

// entities: [User, Appointment, UserPlaysSport, Rating, Participation, Sport, Surface],
export const typeOrmConfig: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  port: 5432,
  entities: ["apps/api/src/entities/*.ts"],
  synchronize: true,
};

export const testDatabaseTypeOrmConfig: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: 'test_database',
  entities: ["apps/api/src/entities/*.ts"],
  dropSchema: true,
  synchronize: true,
}
