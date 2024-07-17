import request from 'supertest';
import { App } from 'supertest/types';
import { CreateAppointmentDto } from '../../../shared/src';
import { registerAndLogin } from './auth.e2e';
import { createSport } from './sport.e2e';

export function testAppointment(getServer: () => App) {
  describe(`/POST appointment`, () => {
    test('should register, login and create appointment', async () => {
      const server = getServer();
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
}
