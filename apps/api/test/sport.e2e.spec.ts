import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateSportDto } from '@rwa/shared';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppointmentModule } from '../src/app/appointment/appointment.module';
import { AuthModule } from '../src/app/auth/auth.module';
import { SportModule } from '../src/app/sport/sport.module';
import { UserModule } from '../src/app/user/user.module';
import { Sport } from '../src/entities/sport';
import { testDatabaseTypeOrmConfig } from '../typeorm.config';

// dataSource = moduleRef.get<DataSource>(getDataSourceToken());
describe.skip('Sport e2e', () => {
  let app: INestApplication;
  let server: App;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRoot(testDatabaseTypeOrmConfig),
        AuthModule,
        SportModule,
        UserModule,
        AppointmentModule,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    server = app.getHttpServer();
  });

  describe(`/POST sport`, () => {
    test('should create sport', async () => {
      const newSport: CreateSportDto = {
        name: 'Fudbal',
        iconUrl: './icon.png'
      }

      const res = await request(server)
        .post('/sports')
        .send(newSport)
        .expect(201)


    });
  });

  afterAll(async () => {
    await app.close();
  });
});


export const createSport = async function (server: App, name: string) {
  const newSport: CreateSportDto = {
    name,
    iconUrl: './icon.png',
  }

  const response = await request(server)
    .post('/sports')
    .send(newSport)

  return response.body as Sport;
}
