import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { CreateSportDto } from '@rwa/shared';
import request from 'supertest';
import { App } from 'supertest/types';
import { TestModule } from '../src/app/test/test.module';
import { Sport } from '../src/entities/sport';

// dataSource = moduleRef.get<DataSource>(getDataSourceToken());
describe.only('Sport e2e', () => {
  let app: INestApplication;
  let server: App;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [TestModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    server = app.getHttpServer();
  });

  describe(`/POST sport`, () => {
    test('should create sport', async () => {
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

  // afterAll(async () => {
  //   await app.close();
  // });
});

export const createSport = async function (server: App, name: string) {
  const newSport: CreateSportDto = {
    name,
    iconUrl: './icon.png',
  };

  const response = await request(server).post('/sports').send(newSport);

  return response.body as Sport;
};
