import request from 'supertest';
import { App } from 'supertest/types';
import {
  CreateAppointmentDto,
  UpdateAppointmentDto,
} from '../../../shared/src';
import { createSport, createSurface, ezLogin } from './helper/helper';
import { Appointment } from '../src/entities/appointment';

export function testAppointment(
  getServer: () => App,
  clearDatabase: () => Promise<void>
) {
  describe(`/appointments`, () => {
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
    let accessToken: string;

    it('should not be possible to create appointment without being logged in', async () => {
      const server = getServer();
      const res = await request(server).post('/appointments').expect(401);
    });

    it('should create appointment', async () => {
      const server = getServer();
      accessToken = await ezLogin(server);
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

    it('should retrieve list of appointments which contain created appointment', async () => {
      const server = getServer();

      const appointments = (
        await request(server).get(`/appointments`).expect(200)
      ).body as Appointment[];

      expect(appointments).toBeDefined();
      expect(Array.isArray(appointments)).toBe(true);

      const appointment = appointments.find((a) => a.id == id);

      expect(appointment).toBeDefined();

      const { duration, ...rest } = appointment!;
      expect(appointment).toMatchObject({
        ...rest,
        duration: {
          hours: 2,
          minutes: 30,
        },
      });
    });

    it('should cancel the appointment', async () => {
      const server = getServer();

      const uncanceledAppointment = (
        await request(server).get(`/appointments/${id}`).expect(200)
      ).body as Appointment;
      expect(uncanceledAppointment.canceled).toBe(false);

      await request(server)
        .post(`/appointments/${id}/cancel`)
        .auth(accessToken, { type: 'bearer' })
        .expect(200);

      const canceledAppointment = (
        await request(server).get(`/appointments/${id}`).expect(200)
      ).body as Appointment;
      expect(canceledAppointment.canceled).toBe(true);

      const appointments = (
        await request(server).get(`/appointments?canceled=false`).expect(200)
      ).body as Appointment[];

      expect(Array.isArray(appointments)).toBe(true);
      expect(appointments.length).toBe(0);
    });

    it('should update the appointment', async () => {
      const server = getServer();

      const update: UpdateAppointmentDto = {
        location: 'ndwad',
      };

      const res = await request(server)
        .patch(`/appointments/${id}`)
        .auth(accessToken, { type: 'bearer' })
        .send(update)
        .expect(200);
    });
  });
}
