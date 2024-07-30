import request from 'supertest';
import { App } from 'supertest/types';
import {
  CreateAppointmentDto,
  FindAppointmentsDto,
  UpdateAppointmentDto,
} from '../../../shared/src';
import { Appointment } from '../src/entities/appointment';
import { Sport } from '../src/entities/sport';
import { Surface } from '../src/entities/surface';
import {
  createAppointment,
  createSport,
  createSurface,
  ezLogin,
} from './helper/helper';
import { fileURLToPath } from 'url';

export function testAppointment(
  getServer: () => App,
  clearDatabase: () => Promise<void>
) {
  describe(`/appointments`, () => {
    let server: App;
    beforeAll(async () => {
      await clearDatabase();
      server = getServer();
    });

    let accessTokenOrganizer1: string;
    let accessTokenOrganizer2: string;

    const leskovacId = 'ChIJOS9xY7KCVUcROAbIlRA1s9E';
    const nisId = 'ChIJZR_IQMKwVUcRzcMqEuOfMVY';
    const beogradId = 'ChIJvT-116N6WkcR5H4X8lxkuB0';

    let soccer: Sport;
    let basketball: Sport;
    let tenis: Sport;

    let grass: Surface;
    let concrete: Surface;
    let hardwood: Surface;

    beforeAll(async () => {
      accessTokenOrganizer1 = await ezLogin(server);
      accessTokenOrganizer2 = await ezLogin(server);

      grass = await createSurface(server, 'grass');
      concrete = await createSurface(server, 'concrete');
      hardwood = await createSurface(server, 'hardwood');

      soccer = await createSport(server, 'soccer');
      basketball = await createSport(server, 'basketball');
      tenis = await createSport(server, 'tenis');
    });

    it('should not be possible to create appointment without being logged in', async () => {
      await request(server).post('/appointments').expect(401);
    });

    let newAppointment: CreateAppointmentDto = {
      locationId: leskovacId,
      date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
      startTime: '19:00:00',
      duration: '2 hours 30 minutes',
      totalPlayers: 10,
      missingPlayers: 8,
      minSkillLevel: 1,
      maxSkillLevel: 3,
      minAge: 10,
      maxAge: 35,
      pricePerPlayer: 0,
      additionalInformation: '',
      surfaceId: -99,
      sportId: -99,
    };
    let appointment1Id: number;

    it('should create an appointment', async () => {
      newAppointment.sportId = soccer.id;
      newAppointment.surfaceId = grass.id;

      const res = await request(server)
        .post('/appointments')
        .auth(accessTokenOrganizer1, { type: 'bearer' })
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

      appointment1Id = appointment.id;
    });

    it('should retrieve created appointment', async () => {
      const appointment = (
        await request(server).get(`/appointments/${appointment1Id}`).expect(200)
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
      const appointments = (
        await request(server).get(`/appointments`).expect(200)
      ).body as Appointment[];

      expect(appointments).toBeDefined();
      expect(Array.isArray(appointments)).toBe(true);

      const appointment = appointments.find((a) => a.id == appointment1Id);

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
      const uncanceledAppointment = (
        await request(server).get(`/appointments/${appointment1Id}`).expect(200)
      ).body as Appointment;
      expect(uncanceledAppointment.canceled).toBe(false);

      await request(server)
        .post(`/appointments/${appointment1Id}/cancel`)
        .auth(accessTokenOrganizer1, { type: 'bearer' })
        .expect(200);

      const canceledAppointment = (
        await request(server).get(`/appointments/${appointment1Id}`).expect(200)
      ).body as Appointment;
      expect(canceledAppointment.canceled).toBe(true);

      const appointments = (
        await request(server)
          .get(`/appointments`)
          .send({
            filters: {
              canceled: false,
            },
          } as FindAppointmentsDto)
          .expect(200)
      ).body as Appointment[];

      expect(Array.isArray(appointments)).toBe(true);
      expect(appointments.length).toBe(0);
    });

    it('should update the appointment', async () => {
      const update: UpdateAppointmentDto = {
        missingPlayers: 5,
      };

      const res = await request(server)
        .patch(`/appointments/${appointment1Id}`)
        .auth(accessTokenOrganizer1, { type: 'bearer' })
        .send(update)
        .expect(200);
    });

    it('should create more appointments', async () => {
      await createAppointment(server, accessTokenOrganizer1, {
        locationId: beogradId,
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0],
        startTime: '20:00:00',
        duration: '1 hour 30 minutes',
        totalPlayers: 4,
        missingPlayers: 3,
        minSkillLevel: 3,
        maxSkillLevel: 5,
        minAge: 30,
        maxAge: 35,
        pricePerPlayer: 700,
        additionalInformation: '',
        surfaceId: concrete.id,
        sportId: soccer.id,
      });

      await createAppointment(server, accessTokenOrganizer1, {
        locationId: nisId,
        date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0],
        startTime: '14:00:00',
        duration: '2 hours',
        totalPlayers: 10,
        missingPlayers: 5,
        minSkillLevel: 1,
        maxSkillLevel: 3,
        minAge: 10,
        maxAge: 20,
        pricePerPlayer: 300,
        additionalInformation: '',
        surfaceId: hardwood.id,
        sportId: tenis.id,
      });
    });

    describe('filters', () => {
      it('all', async () => {
        let appointments = (
          await request(server)
            .get(`/appointments`)
            .send({} as FindAppointmentsDto)
            .expect(200)
        ).body;
        expect(appointments.length).toBe(3);
      });

      it('sportId', async () => {
        let appointments = (
          await request(server)
            .get(`/appointments`)
            .send({
              filters: {
                sportId: soccer.id,
              },
            } as FindAppointmentsDto)
            .expect(200)
        ).body;
        expect(appointments.length).toBe(2);
      });

      it('maxDistance', async () => {
        let appointments = (
          await request(server)
            .get(`/appointments`)
            .send({
              filters: {
                maxDistance: 33,
              },
              userLocation: {
                lat: 43.0260343,
                lng: 21.918993,
              },
              ordering: {
                by: 'distance',
                direction: 'ASC',
              },
            } as FindAppointmentsDto)
            .expect(200)
        ).body;
        expect(appointments.length).toBe(2);
      });

      it('too young', async () => {
        let appointments = (
          await request(server)
            .get(`/appointments`)
            .send({
              filters: {
                age: 5,
              },
            } as FindAppointmentsDto)
            .expect(200)
        ).body;
        expect(appointments.length).toBe(0);
      });

      it('too old', async () => {
        let appointments = (
          await request(server)
            .get(`/appointments`)
            .send({
              filters: {
                age: 55,
              },
            } as FindAppointmentsDto)
            .expect(200)
        ).body;
        expect(appointments.length).toBe(0);
      });

      it('right age', async () => {
        let appointments = (
          await request(server)
            .get(`/appointments`)
            .send({
              filters: {
                age: 15,
              },
            } as FindAppointmentsDto)
            .expect(200)
        ).body;
        expect(appointments.length).toBe(2);
      });

      it('not canceled', async () => {
        let appointments = (
          await request(server)
            .get(`/appointments`)
            .send({
              filters: {
                canceled: false,
              },
            } as FindAppointmentsDto)
            .expect(200)
        ).body;
        expect(appointments.length).toBe(2);
      });

      it('max date', async () => {
        let appointments = (
          await request(server)
            .get(`/appointments`)
            .send({
              filters: {
                maxDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000)
                  .toISOString()
                  .split('T')[0],
              },
            } as FindAppointmentsDto)
            .expect(200)
        ).body;
        expect(appointments.length).toBe(2);
      });

      it('min date', async () => {
        let appointments = (
          await request(server)
            .get(`/appointments`)
            .send({
              filters: {
                minDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000)
                  .toISOString()
                  .split('T')[0],
              },
            } as FindAppointmentsDto)
            .expect(200)
        ).body;
        expect(appointments.length).toBe(1);
      });

      it('min time', async () => {
        let appointments = (
          await request(server)
            .get(`/appointments`)
            .send({
              filters: {
                minTime: '19:00:00',
              },
            } as FindAppointmentsDto)
            .expect(200)
        ).body;
        expect(appointments.length).toBe(2);
      });

      it('max time', async () => {
        let appointments = (
          await request(server)
            .get(`/appointments`)
            .send({
              filters: {
                maxTime: '19:00:00',
              },
            } as FindAppointmentsDto)
            .expect(200)
        ).body;
        expect(appointments.length).toBe(2);
      });

      it('min time and max time', async () => {
        let appointments = (
          await request(server)
            .get(`/appointments`)
            .send({
              filters: {
                minTime: '18:00:00',
                maxTime: '19:00:00',
              },
            } as FindAppointmentsDto)
            .expect(200)
        ).body;
        expect(appointments.length).toBe(1);
      });

      it('canceled', async () => {
        let appointments = (
          await request(server)
            .get(`/appointments`)
            .send({
              filters: {
                canceled: true,
              },
            } as FindAppointmentsDto)
            .expect(200)
        ).body;
        expect(appointments.length).toBe(1);
      });

      it('skip', async () => {
        let appointments = (
          await request(server)
            .get(`/appointments`)
            .send({
              filters: {
                skip: 10,
              },
            } as FindAppointmentsDto)
            .expect(200)
        ).body;
        expect(appointments.length).toBe(0);
      });

      it('distance asc', async () => {
        let appointments = (
          await request(server)
            .get(`/appointments`)
            .send({
              ordering: {
                by: 'distance',
                direction: 'ASC',
              },
              userLocation: {
                lat: 43.0260343,
                lng: 21.918993,
              },
            } as FindAppointmentsDto)
            .expect(200)
        ).body;
        expect(appointments.length).toBe(3);
        expect(appointments[0].location.id).toBe(leskovacId);
        expect(appointments[1].location.id).toBe(nisId);
        expect(appointments[2].location.id).toBe(beogradId);
      });

      it('distance desc', async () => {
        let appointments = (
          await request(server)
            .get(`/appointments`)
            .send({
              ordering: {
                by: 'distance',
                direction: 'DESC',
              },
              userLocation: {
                lat: 43.0260343,
                lng: 21.918993,
              },
            } as FindAppointmentsDto)
            .expect(200)
        ).body;
        expect(appointments.length).toBe(3);
        expect(appointments[0].location.id).toBe(beogradId);
        expect(appointments[1].location.id).toBe(nisId);
        expect(appointments[2].location.id).toBe(leskovacId);
      });

      it('price', async () => {
        let appointments = (
          await request(server)
            .get(`/appointments`)
            .send({
              ordering: {
                by: 'price',
                direction: 'ASC',
              },
            } as FindAppointmentsDto)
            .expect(200)
        ).body;
        expect(appointments.length).toBe(3);
        expect(appointments[0].location.id).toBe(leskovacId);
        expect(appointments[1].location.id).toBe(nisId);
        expect(appointments[2].location.id).toBe(beogradId);
      });

      it('date', async () => {
        let appointments = (
          await request(server)
            .get(`/appointments`)
            .send({
              ordering: {
                by: 'date',
                direction: 'ASC',
              },
            } as FindAppointmentsDto)
            .expect(200)
        ).body;
        expect(appointments.length).toBe(3);
        expect(appointments[0].location.id).toBe(nisId);
        expect(appointments[1].location.id).toBe(leskovacId);
        expect(appointments[2].location.id).toBe(beogradId);
      });
    });
  });
}
