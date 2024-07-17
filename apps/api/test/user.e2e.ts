import request from 'supertest';
import { App } from 'supertest/types';
import { CreateUserDto } from '../../../shared/src';

export function testUser(getServer: () => App) {
  describe(`/POST users`, () => {
    it('should create new user', async () => {
      const server = getServer();

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
}

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
