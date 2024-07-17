import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { request } from 'http';
import { App } from 'supertest/types';
import { CreateSurfaceDto } from '../../../shared/src';
import { TestModule } from '../src/app/test/test.module';

describe.only('e2e tests', () => {
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

  describe(`/POST surface`, () => {
    test('should create surface', async () => {
      const newSurface: CreateSurfaceDto = {
        name: 'Trava',
      };

      const res = await request(server)
        .post('/surfaces')
        .send(newSurface)
        .expect(201);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
