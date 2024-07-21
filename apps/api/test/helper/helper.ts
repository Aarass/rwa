import request from 'supertest';
import { App } from 'supertest/types';
import {
  AccessToken,
  CreateAppointmentDto,
  CreateSportDto,
  CreateSurfaceDto,
  CreateUserDto,
} from '../../../../shared/src';
import { Sport } from '../../src/entities/sport';
import { User } from '../../src/entities/user';
import { Surface } from '../../src/entities/surface';
import { Appointment } from '../../src/entities/appointment';

export const createUser = async function (
  server: App,
  username: string,
  password: string
) {
  const newUser: CreateUserDto = {
    username,
    password,
    name: 'agjsdagba',
    surname: 'bgsgasgdg',
    city: 'cgsgagj',
    biography: '',
    birthDate: '2002-08-29',
    phoneNumber: '0630233307',
  };

  return (await request(server).post('/users').send(newUser)).body as User;
};

export const createSport = async function (server: App, name: string) {
  const newSport: CreateSportDto = {
    name,
    iconUrl: './icon.png',
  };

  if (process.env.ADMIN_TOKEN == undefined) {
    console.error('No admin token in .env');
    throw '';
  }

  const res = await request(server)
    .post('/sports')
    .auth(process.env.ADMIN_TOKEN, { type: 'bearer' })
    .send(newSport)
    .expect(201);

  return res.body as Sport;
};

export const createSurface = async function (server: App, name: string) {
  const newSurface: CreateSurfaceDto = { name };

  return (
    await request(server)
      .post('/surfaces')
      .auth(process.env.ADMIN_TOKEN!, { type: 'bearer' })
      .send(newSurface)
  ).body as Surface;
};

export const ezLogin = async function (server: App) {
  const username = 'admin' + Math.random() * 100;
  const password = 'password';

  await request(server).post('/auth/register').send({
    username,
    password,
    name: 'agjsdagba',
    surname: 'bgsgasgdg',
    city: 'cgsgagj',
    biography: '',
    birthDate: '2002-08-29',
    phoneNumber: '0630233307',
  });

  return (
    await request(server).post('/auth/login').send({
      username,
      password,
    })
  ).body.accessToken as AccessToken;
};

export const createAppointment = async function (
  server: App,
  accessToken: string,
  newAppointment: CreateAppointmentDto
) {
  return (
    await request(server)
      .post('/appointments')
      .auth(accessToken, { type: 'bearer' })
      .send(newAppointment)
  ).body as Appointment;
};
