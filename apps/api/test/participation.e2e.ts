import request from 'supertest';
import { App } from 'supertest/types';
import {
  createAppointment,
  createSport,
  createSurface,
  ezLogin,
} from './helper/helper';
import {
  CreateAppointmentDto,
  CreateParticipationDto,
  UpdateAppointmentDto,
} from '../../../shared/src';
import { Participation } from '../src/entities/participation';
import { authenticate } from 'passport';

export function testParticipation(
  getServer: () => App,
  clearDatabase: () => Promise<void>
) {
  describe(`/participations`, () => {
    beforeAll(async () => {
      await clearDatabase();
    });

    let participationId: number;
    let appointmentId: number;
    let accessTokenOrganizer: string;
    let accessTokenParticipant: string;

    it('should create an appointment and a participation', async () => {
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

      const server = getServer();
      accessTokenOrganizer = await ezLogin(server);
      const surface = await createSurface(server, 'trava');
      const sport = await createSport(server, 'fudbal');

      newAppointment.surfaceId = surface.id;
      newAppointment.sportId = sport.id;
      const appointment = await createAppointment(
        server,
        accessTokenOrganizer,
        newAppointment
      );

      const newParticipation: CreateParticipationDto = {
        appointmentId: appointment.id,
      };

      accessTokenParticipant = await ezLogin(server);

      const response = await request(server)
        .post('/participations')
        .auth(accessTokenParticipant, { type: 'bearer' })
        .send(newParticipation)
        .expect(201);

      const participation = response.body as Participation;

      expect(participation.appointmentId).toBe(appointment.id);
      expect(participation.approved).toBe(true);
      expect(participation.userHasSeenChanges).toBe(true);

      participationId = participation.id;
      appointmentId = participation.appointment.id;
    });

    it('should retrive created participation', async () => {
      const server = getServer();

      const response = await request(server)
        .get(`/participations/${participationId}`)
        .expect(200);

      const participation = response.body as Participation;

      expect(participation.id).toBe(participationId);
      expect(participation.appointmentId).toBe(appointmentId);
      expect(participation.approved).toBe(true);
      expect(participation.userHasSeenChanges).toBe(true);
    });

    it('should not allow to reject participation', async () => {
      const server = getServer();

      const response = await request(server)
        .patch(`/participations/${participationId}/reject`)
        .auth(accessTokenParticipant, { type: 'bearer' })
        .expect(403);
    });

    it('should reject participation', async () => {
      const server = getServer();

      const response = await request(server)
        .patch(`/participations/${participationId}/reject`)
        .auth(accessTokenOrganizer, { type: 'bearer' })
        .expect(200);
    });

    it('should retrive rejected participation', async () => {
      const server = getServer();

      const response = await request(server)
        .get(`/participations/${participationId}`)
        .expect(200);

      const participation = response.body as Participation;

      expect(participation.id).toBe(participationId);
      expect(participation.appointmentId).toBe(appointmentId);
      expect(participation.approved).toBe(false);
      expect(participation.userHasSeenChanges).toBe(true);
    });

    it('should retrive dirty participation', async () => {
      const server = getServer();

      const update: UpdateAppointmentDto = {
        location: 'ndwad',
      };

      const res = await request(server)
        .patch(`/appointments/${appointmentId}`)
        .auth(accessTokenOrganizer, { type: 'bearer' })
        .send(update)
        .expect(200);

      const response = await request(server)
        .get(`/participations/${participationId}`)
        .expect(200);

      const participation = response.body as Participation;
      expect(participation.userHasSeenChanges).toBe(false);
    });

    it('should not allow organizer to remove dirty flag from appointment', async () => {
      const server = getServer();

      await request(server)
        .patch(`/participations/${participationId}/seen`)
        .auth(accessTokenOrganizer, { type: 'bearer' })
        .expect(403);
    });

    it('should remove dirty flag from appointment', async () => {
      const server = getServer();

      await request(server)
        .patch(`/participations/${participationId}/seen`)
        .auth(accessTokenParticipant, { type: 'bearer' })
        .expect(200);

      const response = await request(server)
        .get(`/participations/${participationId}`)
        .expect(200);

      const participation = response.body as Participation;
      expect(participation.userHasSeenChanges).toBe(true);
    });

    it('should not allow user to delete foreign appointment', async () => {
      const server = getServer();

      await request(server)
        .delete(`/participations/${participationId}`)
        .auth(accessTokenOrganizer, { type: 'bearer' })
        .expect(403);
    });

    it('should delete appointment', async () => {
      const server = getServer();

      await request(server)
        .delete(`/participations/${participationId}`)
        .auth(accessTokenParticipant, { type: 'bearer' })
        .expect(200);
    });
  });
}
