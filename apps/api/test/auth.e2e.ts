import request from 'supertest';
import { App } from 'supertest/types';
import { RegisterUserDto } from '../../../shared/src';
import { createUser } from './user.e2e';

export function testAuth(getServer: () => App) {
  describe.only(`/POST auth`, () => {
    it('should register new user', async () => {
      const server = getServer();

      const newUser: RegisterUserDto = {
        username: 'Aaras',
        password: 'password',
        name: 'Aleksandar',
        surname: 'Prokopovic',
        city: 'Leskovac',
        biography: '',
        birthDate: '1999-01-08',
        phoneNumber: '0621715606',
      };

      const response = await request(server)
        .post('/auth/register')
        .send(newUser)
        .expect(200);
    });

    let accessToken: string, refreshToken: string;

    it('should log in user', async () => {
      const server = getServer();

      const username = 'Aaras';
      const password = 'password';

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
      expect(cookies![0]).toMatch(/^refresh_token=/);

      const cookie = cookies![0];
      refreshToken = cookie.substring(14).slice(0, cookie.length - 14 - 26);

      expect(response).toHaveProperty('body');
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body.accessToken).not.toBeNull();

      accessToken = response.body.accessToken;
    });

    it('should return 200 and user', async () => {
      const server = getServer();

      await request(server)
        .post('/auth/test')
        .auth(accessToken, { type: 'bearer' })
        .expect(200);
    });

    it('should return new access token and set new refresh token', async () => {
      const server = getServer();

      const req = request(server)
        .post('/auth/refresh')
        .set('Cookie', [`refresh_token=${refreshToken}`]);

      const response = await req;
    });
  });
}

export const registerAndLogin = async function (server: App) {
  const username = 'admin';
  const password = 'password';

  await createUser(server, username, password);

  const response = await request(server).post('/auth/login').send({
    username,
    password,
  });

  const accessToken = response.body.accessToken as string;

  return accessToken;
};

export const extractRefreshToken = function (response: Response) {};
