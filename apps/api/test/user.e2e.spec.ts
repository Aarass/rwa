import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { CreateUserDto } from '@rwa/shared';
import request from 'supertest';
import { App } from 'supertest/types';
import { TestModule } from '../src/app/test/test.module';

describe.only('User e2e', () => {
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

  describe(`/POST users`, () => {
    it('should create new user', async () => {
      const newUser: CreateUserDto = {
        username: 'Aaras',
        password: 'password',
        name: 'Aleksandar',
        surname: 'Prokopovic',
        city: 'Leskovac',
        biography: '',
        birthDate: '1999-01-08',
        phoneNumber: '0621715606',
      };

      const response = await request(server).post('/users').send(newUser);

      expect(response.status).toBe(201);

      const { password, ...rest } = newUser;
      const partialExpectedResult = {
        id: 1,
        ...rest,
      };
      expect(response.body).toMatchObject(partialExpectedResult);
    });
  });

  describe(`/GET users`, () => {
    it('should return all users', async () => {
      const response = await request(server).get('/users');

      expect(response.status).toBe(200);
    });
  });

  // afterAll(async () => {
  //   await app.close();
  // });
});

export const createUser = async function (
  server: App,
  username: string,
  password: string
) {
  const newUser: CreateUserDto = {
    username,
    password,
    name: 'Aleksandar',
    surname: 'Prokopovic',
    city: 'Leskovac',
    biography: '',
    birthDate: '2002-08-29',
    phoneNumber: '0621715606',
  };

  await request(server).post('/users').send(newUser);
};
