import request from 'supertest';
import { App } from 'supertest/types';
import {
  createAppointment,
  createSport,
  createSurface,
  createUser,
  ezLogin,
} from './helper/helper';
import {
  CreateAppointmentDto,
  CreateParticipationDto,
  UpdateAppointmentDto,
  CreateUpsDto,
} from '../../../shared/src';
import { Participation } from '../src/entities/participation';
import { authenticate } from 'passport';
import { UserPlaysSport } from '../src/entities/user-plays-sport';

export function testUps(
  getServer: () => App,
  clearDatabase: () => Promise<void>
) {
  describe(`/ups`, () => {
    beforeAll(async () => {
      await clearDatabase();
    });

    let accessToken: string;
    let upsId: number;

    it('should create user, sport and ups', async () => {
      const server = getServer();

      accessToken = await ezLogin(server);
      const sport = await createSport(server, 'fudbal');

      const newUps: CreateUpsDto = {
        sportId: sport.id,
        selfRatedSkillLevel: 3,
      };

      const ups = (
        await request(server)
          .post('/ups')
          .auth(accessToken, { type: 'bearer' })
          .send(newUps)
          .expect(201)
      ).body as UserPlaysSport;

      expect(ups).toMatchObject(newUps);

      upsId = ups.id;
    });

    it('should retrive ups', async () => {
      const server = getServer();

      const upss = (
        await request(server)
          .get('/ups/user/me')
          .auth(accessToken, { type: 'bearer' })
          .expect(200)
      ).body as UserPlaysSport[];

      expect(upss.length).toBe(1);
    });

    it('should delete upss list', async () => {
      const server = getServer();

      console.log(`/ups/${upsId}`);
      const res = await request(server)
        .delete(`/ups/${upsId}`)
        .auth(accessToken, { type: 'bearer' })
        .expect(200);
    });

    it('should retrive empty upss list', async () => {
      const server = getServer();

      const upss = (
        await request(server)
          .get('/ups/user/me')
          .auth(accessToken, { type: 'bearer' })
          .expect(200)
      ).body as UserPlaysSport[];

      expect(upss.length).toBe(0);
    });
  });
}
