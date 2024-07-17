import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { CreateSurfaceDto } from '@rwa/shared';
import request from 'supertest';
import { App } from 'supertest/types';
import { TestModule } from '../src/app/test/test.module';

// dataSource = moduleRef.get<DataSource>(getDataSourceToken());
describe.only('Surface e2e', () => {
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

  // afterAll(async () => {
  //   await app.close();
  // });
});
