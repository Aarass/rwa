import request from 'supertest';
import { App } from 'supertest/types';
import { CreateUserDto } from '../../../shared/src';
import { User } from '../src/entities/user';
import { use } from 'passport';

export function testUser(getServer: () => App) {
  let id: number;
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

  const { password, ...rest } = newUser;
  const partialExpectedResult = {
    ...rest,
  };

  describe(`/POST users`, () => {
    it('should create new user', async () => {
      const server = getServer();

      const createdUser = (
        await request(server).post('/users').send(newUser).expect(201)
      ).body as User;

      expect(createdUser).toMatchObject(partialExpectedResult);

      id = createdUser.id;
    });
  });

  describe(`/GET users`, () => {
    it('should retrive previously created user', async () => {
      const server = getServer();

      const receivedUser = (
        await request(server).get(`/users/${id}`).expect(200)
      ).body as User;

      expect(receivedUser).toMatchObject(partialExpectedResult);
    });

    it('should retive list of users which will contain previously created user', async () => {
      const server = getServer();

      const receivedUsers = (await request(server).get('/users').expect(200))
        .body as User[];

      const user = receivedUsers.find((a) => a.id == id);

      expect(user).not.toBeUndefined();
      expect(user).toMatchObject(partialExpectedResult);
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
