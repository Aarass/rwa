import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { CreateAppointmentDto } from '@rwa/shared';
import request from 'supertest';
import { App } from 'supertest/types';
import { TestModule } from '../src/app/test/test.module';
import { registerAndLogin } from './auth.e2e.spec';
import { createSport } from './sport.e2e.spec';

// dataSource = moduleRef.get<DataSource>(getDataSourceToken());
describe.only('Appointment e2e', () => {
  let app: INestApplication;
  let server: App;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [TestModule],
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
        sportId: 1,
      };

      const res = await request(server)
        .post('/appointment')
        .withCredentials()
        .auth(accessToken, { type: 'bearer' })
        .send(newAppointment)
        .expect(201);

      const sport = await createSport(server, 'fudbal');
    });
  });

  // afterAll(async () => {
  //   await app.close();
  // });
});
