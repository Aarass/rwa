import request from 'supertest';
import { App } from 'supertest/types';
import { createUser } from './user.e2e';

export function testAuth(getServer: () => App) {
  describe(`/POST auth/login`, () => {
    it('should log you in and return tokens', async () => {
      const server = getServer();
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
