import request from 'supertest';
import { App } from 'supertest/types';
import { CreateSportDto } from '../../../shared/src';
import { Sport } from '../src/entities/sport';

export function testSport(getServer: () => App) {
  describe(`/POST sport`, () => {
    test('should create sport', async () => {
      const server = getServer();
      const newSport: CreateSportDto = {
        name: 'Fudbal',
        iconUrl: './icon.png',
      };

      const res = await request(server)
        .post('/sports')
        .send(newSport)
        .expect(201);
    });
  });
}

export const createSport = async function (server: App, name: string) {
  const newSport: CreateSportDto = {
    name,
    iconUrl: './icon.png',
  };

  const response = await request(server).post('/sports').send(newSport);

  return response.body as Sport;
};
