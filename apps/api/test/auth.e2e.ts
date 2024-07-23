import request from 'supertest';
import { App } from 'supertest/types';
import { RegisterUserDto } from '../../../shared/src';

export function testAuth(
  getServer: () => App,
  clearDatabase: () => Promise<void>
) {
  describe(`/auth`, () => {
    beforeAll(async () => {
      await clearDatabase();
    });
    beforeEach(async () => {
      await new Promise((r) => setTimeout(r, 1000));
    });

    it('should register new user', async () => {
      const server = getServer();

      const newUser: RegisterUserDto = {
        username: 'Aaras',
        password: 'password',
        name: 'Aleksandar',
        surname: 'Prokopovic',
        locationId: 'ChIJOS9xY7KCVUcROAbIlRA1s9E',
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

    let newAccessToken: string, newRefreshToken: string;

    it('should return new access token and set new refresh token', async () => {
      const server = getServer();

      const response = await request(server)
        .post('/auth/refresh')
        .set('Cookie', [`refresh_token=${refreshToken}`])
        .expect(200);

      expect(response).toHaveProperty('body');
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body.accessToken).not.toBeNull();

      const cookies = response.get('Set-Cookie');
      expect(cookies).not.toBeUndefined();
      expect(cookies![0]).not.toBeUndefined();
      expect(cookies![0]).toMatch(/^refresh_token=/);
      const cookie = cookies![0];

      newAccessToken = response.body.accessToken;
      newRefreshToken = cookie.substring(14).slice(0, cookie.length - 14 - 26);
    });

    it('should be able to use new access token', async () => {
      const server = getServer();
      await request(server)
        .post('/auth/test')
        .auth(newAccessToken, { type: 'bearer' })
        .expect(200);
    });

    it('should be able to still use old access token until it expires', async () => {
      const server = getServer();
      await request(server)
        .post('/auth/test')
        .auth(accessToken, { type: 'bearer' })
        .expect(200);
    });

    it('should be able to use new refresh token', async () => {
      const server = getServer();
      await request(server)
        .post('/auth/refresh')
        .set('Cookie', [`refresh_token=${newRefreshToken}`])
        .expect(200);
    });

    it(`shouldn't be able to use old refresh token`, async () => {
      const server = getServer();

      await request(server)
        .post('/auth/refresh')
        .set('Cookie', [`refresh_token=${refreshToken}`])
        .expect(403);
    });

    it(`should logout user`, async () => {
      const server = getServer();
      await request(server)
        .post('/auth/logout')
        .set('Cookie', [`refresh_token=${refreshToken}`])
        .expect(200);
    });
  });
}
