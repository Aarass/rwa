import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateSurfaceDto } from '@rwa/shared';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppointmentModule } from '../src/app/appointment/appointment.module';
import { AuthModule } from '../src/app/auth/auth.module';
import { SportModule } from '../src/app/sport/sport.module';
import { UserModule } from '../src/app/user/user.module';
import { Sport } from '../src/entities/sport';
import { testDatabaseTypeOrmConfig } from '../typeorm.config';

// dataSource = moduleRef.get<DataSource>(getDataSourceToken());
describe.only('Surface e2e', () => {
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

  describe(`/POST surface`, () => {
    test('should create surface', async () => {
      const newSurface: CreateSurfaceDto = {
        name: 'Trava',
      }

      const res = await request(server)
        .post('/surfaces')
        .send(newSurface)
        .expect(201)


    });
  });

  afterAll(async () => {
    await app.close();
  });
});
