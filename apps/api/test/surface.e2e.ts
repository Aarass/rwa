import request from 'supertest';
import { App } from 'supertest/types';
import { CreateSurfaceDto } from '../../../shared/src';

export function testSurface(getServer: () => App) {
  describe(`/POST surface`, () => {
    test('should create surface', async () => {
      const server = getServer();
      const newSurface: CreateSurfaceDto = {
        name: 'Trava',
      };

      const res = await request(server)
        .post('/surfaces')
        .send(newSurface)
        .expect(201);
    });
  });
}
