import request from 'supertest';
import { App } from 'supertest/types';
import { CreateSurfaceDto } from '../../../shared/src';
import { Surface } from '../src/entities/surface';

export function testSurface(
  getServer: () => App,
  clearDatabase: () => Promise<void>
) {
  describe(`/surfaces`, () => {
    beforeAll(async () => {
      await clearDatabase();
    });

    const newSurface: CreateSurfaceDto = {
      name: 'Trava',
    };
    let id: number;

    it('should create surface', async () => {
      const server = getServer();

      const res = await request(server)
        .post('/surfaces')
        .auth(process.env.ADMIN_TOKEN!, { type: 'bearer' })
        .send(newSurface)
        .expect(201);

      const surface = res.body;

      expect(surface).toBeDefined();
      expect(surface).toMatchObject(newSurface);

      id = surface.id;
    });

    it('should retrieve previously created surface', async () => {
      const server = getServer();

      const res = await request(server).get(`/surfaces/${id}`).expect(200);

      const surface: Surface = res.body;

      expect(surface).toBeDefined();
      expect(surface.id).toBe(id);
      expect(surface).toMatchObject(newSurface);
    });

    it('should retrieve list of surfaces which contain previously created surface', async () => {
      const server = getServer();

      const res = await request(server).get('/surfaces').expect(200);

      const surfaces: Surface[] = res.body;

      expect(surfaces).toBeDefined();
      expect(surfaces.length).toBeGreaterThan(0);

      const surface = surfaces.find((a) => a.id == id);
      expect(surface).toBeDefined();
      expect(surface!.id).toBe(id);
      expect(surface).toMatchObject(newSurface);
    });

    it('should delete a surface', async () => {
      const server = getServer();

      const res = await request(server)
        .delete(`/surfaces/${id}`)
        .auth(process.env.ADMIN_TOKEN!, { type: 'bearer' })
        .expect(200);
    });

    it('should recieve an error', async () => {
      const server = getServer();

      const res = await request(server).get(`/surfaces/${id}`).expect(404);
    });
  });
}
