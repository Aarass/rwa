import request from 'supertest';
import { App } from 'supertest/types';
import { CreateSportDto } from '../../../shared/src';
import { Sport } from '../src/entities/sport';
import { ezLogin } from './helper/helper';

export function testSport(
  getServer: () => App,
  clearDatabase: () => Promise<void>
) {
  const newSport: CreateSportDto = {
    name: 'Fudbal',
    iconUrl: './icon.png',
  };
  let id: number;

  describe(`/sports`, () => {
    beforeAll(async () => {
      await clearDatabase();
    });

    it('should create sport', async () => {
      const server = getServer();

      const res = await request(server)
        .post('/sports')
        .auth(process.env.ADMIN_TOKEN!, { type: 'bearer' })
        .send(newSport)
        .expect(201);

      const sport = res.body;

      expect(sport).toBeDefined();
      expect(sport).toMatchObject(newSport);

      id = sport.id;
    });

    it('should retrieve previously created sport', async () => {
      const server = getServer();

      const res = await request(server).get(`/sports/${id}`).expect(200);

      const sport: Sport = res.body;

      expect(sport).toBeDefined();
      expect(sport.id).toBe(id);
      expect(sport).toMatchObject(newSport);
    });

    it('should retrieve list of sports which contain previously created sport', async () => {
      const server = getServer();

      const res = await request(server).get('/sports').expect(200);

      const sports: Sport[] = res.body;

      expect(sports).toBeDefined();
      expect(sports.length).toBeGreaterThan(0);

      const sport = sports.find((a) => a.id == id);
      expect(sport).toBeDefined();
      expect(sport!.id).toBe(id);
      expect(sport).toMatchObject(newSport);
    });

    it('should delete a sport', async () => {
      const server = getServer();

      const res = await request(server)
        .delete(`/sports/${id}`)
        .auth(process.env.ADMIN_TOKEN!, { type: 'bearer' })
        .expect(200);
    });

    it('should recieve an error', async () => {
      const server = getServer();

      const res = await request(server).get(`/sports/${id}`).expect(404);
    });
  });
}
