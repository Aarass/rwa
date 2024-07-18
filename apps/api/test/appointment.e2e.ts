import request from 'supertest';
import { App } from 'supertest/types';
import { CreateAppointmentDto } from '../../../shared/src';
import { createSport, createSurface, ezLogin } from './helper/helper';
import { Appointment } from '../src/entities/appointment';

export function testAppointment(
  getServer: () => App,
  clearDatabase: () => Promise<void>
) {
  describe.only(`/appointments`, () => {
    beforeAll(async () => {
      await clearDatabase();
    });

    let newAppointment: CreateAppointmentDto = {
      location: 'Skolsko dvorisete u Vinarce',
      date: '2024-07-20',
      startTime: '19:00:00',
      duration: '2 hours 30 minutes',
      totalPlayers: 10,
      missingPlayers: 10,
      minSkillLevel: 1,
      maxSkillLevel: 3,
      minAge: -1,
      maxAge: -1,
      pricePerPlayer: 0,
      additionalInformation: '',
      surfaceId: -99,
      sportId: -99,
    };
    let id: number;

    it('should not be possible to create appointment without being logged in', async () => {
      const server = getServer();
      const res = await request(server).post('/appointments').expect(401);
    });

    it('should create appointment', async () => {
      const server = getServer();
      const accessToken = await ezLogin(server);
      const surface = await createSurface(server, 'trava');
      const sport = await createSport(server, 'fudbal');

      newAppointment.surfaceId = surface.id;
      newAppointment.sportId = sport.id;

      const res = await request(server)
        .post('/appointments')
        .auth(accessToken, { type: 'bearer' })
        .send(newAppointment)
        .expect(201);

      const appointment = res.body;

      expect(appointment).toBeDefined();

      const { duration, ...rest } = newAppointment;
      expect(appointment).toMatchObject({
        ...rest,
        duration: {
          hours: 2,
          minutes: 30,
        },
      });

      id = appointment.id;
    });

    it('should retrieve created appointment', async () => {
      const server = getServer();

      const appointment = (
        await request(server).get(`/appointments/${id}`).expect(200)
      ).body as Appointment;

      expect(appointment).toBeDefined();

      const { duration, ...rest } = newAppointment;
      expect(appointment).toMatchObject({
        ...rest,
        duration: {
          hours: 2,
          minutes: 30,
        },
      });
    });
  });
}
