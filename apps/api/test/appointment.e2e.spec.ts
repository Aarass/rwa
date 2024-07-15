import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { TypeOrmModule, getDataSourceToken } from '@nestjs/typeorm';
import { CreateAppointmentDto, CreateUserDto } from '@rwa/shared';
import request from 'supertest';
import { App } from 'supertest/types';
import { AuthModule } from '../src/app/auth/auth.module'
import { UserModule } from '../src/app/user/user.module';
import { SportModule } from '../src/app/sport/sport.module';
import { AppointmentModule } from '../src/app/appointment/appointment.module';
import { testDatabaseTypeOrmConfig } from '../typeorm.config';
import { registerAndLogin } from './auth.e2e.spec';
import { DataSource } from 'typeorm';
import { createSport } from './sport.e2e.spec';

// dataSource = moduleRef.get<DataSource>(getDataSourceToken());
describe.skip('Appointment e2e', () => {
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

  describe(`/POST appointment`, () => {
    test('should register, login and create appointment', async () => {
      const accessToken = await registerAndLogin(server);

      const newAppointment: CreateAppointmentDto = {
        location: 'Skolsko dvorisete u Vinarce',
        date: '2024-07-20',
        startTime: '19:00',
        duration: '2 hours',
        totalPlayers: 10,
        missingPlayers: 10,
        minSkillLevel: 1,
        maxSkillLevel: 3,
        minAge: -1,
        maxAge: -1,
        pricePerPlayer: 0,
        additionalInformation: '',
        surfaceId: 1,
        sportId: 1
      }

      const res = await request(server)
        .post('/appointment')
        .withCredentials()
        .auth(accessToken, { type: "bearer" })
        .send(newAppointment)
        .expect(400)

      const sport = await createSport(server, 'fudbal');


    });
  });

  afterAll(async () => {
    await app.close();
  });
});


