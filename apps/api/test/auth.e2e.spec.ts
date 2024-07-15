import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import request from 'supertest';
import { App } from 'supertest/types';

import { AuthModule } from '../src/app/auth/auth.module'
import { UserModule } from '../src/app/user/user.module';
import { SportModule } from '../src/app/sport/sport.module';
import { AppointmentModule } from '../src/app/appointment/appointment.module';
import { testDatabaseTypeOrmConfig } from '../typeorm.config';
import { createUser } from './user.e2e.spec';

describe.skip('User e2e', () => {
  let app: INestApplication;
  let server: App;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRoot(testDatabaseTypeOrmConfig),
        AuthModule,
        SportModule,
        UserModule,
        AppointmentModule,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    server = app.getHttpServer();
  });

  describe(`/POST auth/login`, () => {
    it('should log you in and return tokens', async () => {
      const username = 'admin';
      const password = 'password';

      await createUser(server, username, password);

      const response = await request(server)
        .post('/auth/login')
        .send({
          username,
          password,
        })
        .expect(200);

      const cookies = response.get('Set-Cookie');
      expect(cookies).not.toBeUndefined();
      expect(cookies![0]).not.toBeUndefined();
      expect(response).toHaveProperty('body');
      expect(response.body).toHaveProperty('accessToken');

      const accessToken = response.body.accessToken;

      expect(accessToken).not.toBeNull();
    });
  });

  afterAll(async () => {
    await app.close();
  });
});

export const registerAndLogin = async function (server: App) {
  const username = 'admin';
  const password = 'password';

  await createUser(server, username, password);

  const response = await request(server)
    .post('/auth/login')
    .send({
      username,
      password,
    })

  const accessToken = response.body.accessToken as string;

  return accessToken;
}
