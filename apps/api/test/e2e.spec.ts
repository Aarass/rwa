import { Test, TestingModule } from '@nestjs/testing';
import { App } from 'supertest/types';
import { TestModule } from '../src/app/test/test.module';
import { testAppointment } from './appointment.e2e';
import { testAuth } from './auth.e2e';
import { testSport } from './sport.e2e';
import { testSurface } from './surface.e2e';
import { testUser } from './user.e2e';
import cookieParser from 'cookie-parser';
import { GlobalInterceptor } from '../src/app/global/global.interceptor';
import { DataSource, getConnection } from 'typeorm';
import { testParticipation } from './participation.e2e';

describe('e2e tests', () => {
  let server: App;
  let moduleRef: TestingModule;
  let dataSource: DataSource;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [TestModule],
    }).compile();

    let app = moduleRef.createNestApplication();
    app.use(cookieParser());
    app.useGlobalInterceptors(new GlobalInterceptor());
    await app.init();

    dataSource = moduleRef.get<DataSource>(DataSource);

    server = app.getHttpServer();
  });

  const getServer = () => {
    return server;
  };

  const clearDatabase = async () => {
    const entities = dataSource.entityMetadatas;
    for (const entity of entities) {
      const repository = await dataSource.getRepository(entity.name);
      const query = `TRUNCATE "${entity.tableName}" RESTART IDENTITY CASCADE;`;
      await repository.query(query);
    }
  };

  testUser(getServer, clearDatabase);
  testAuth(getServer, clearDatabase);
  testSport(getServer, clearDatabase);
  testSurface(getServer, clearDatabase);
  testAppointment(getServer, clearDatabase);
  testParticipation(getServer, clearDatabase);

  afterAll(async () => {
    moduleRef.close();
  });
});
