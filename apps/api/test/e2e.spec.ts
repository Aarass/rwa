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

describe('e2e tests', () => {
  let server: App;
  let moduleRef: TestingModule;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [TestModule],
    }).compile();

    let app = moduleRef.createNestApplication();
    app.use(cookieParser());
    app.useGlobalInterceptors(new GlobalInterceptor());
    await app.init();

    server = app.getHttpServer();
  });

  const getServer = () => {
    return server;
  };

  testUser(getServer);
  testAuth(getServer);
  testSport(getServer);
  testSurface(getServer);
  testAppointment(getServer);

  afterAll(async () => {
    moduleRef.close();
  });
});
