import request from 'supertest';
import { App } from 'supertest/types';
import {
  AccessToken,
  AppointmentFilters,
  CreateAppointmentDto,
  CreateSportDto,
  CreateSurfaceDto,
  CreateUpsDto,
  CreateUserDto,
  FindAppointmentsDto,
} from '../../../../shared/src';
import {
  Appointment,
  Sport,
  Surface,
  User,
  UserPlaysSport,
} from '../../../../entities/src';

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
    locationId: 'ChIJOS9xY7KCVUcROAbIlRA1s9E',
    biography: '',
    birthDate: '2002-08-29',
    phoneNumber: '0630233307',
  };

  return (await request(server).post('/users').send(newUser)).body as User;
};

export const createSport = async function (server: App, name: string) {
  const newSport: CreateSportDto = {
    name,
    imageName: './icon.png',
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

export const createUps = async function (
  server: App,
  accessToken: string,
  sportId: number,
  rating: number
) {
  const newUps: CreateUpsDto = {
    sportId: sportId,
    selfRatedSkillLevel: rating,
  };

  const ups = (
    await request(server)
      .post('/ups')
      .auth(accessToken, { type: 'bearer' })
      .send(newUps)
      .expect(201)
  ).body as UserPlaysSport;

  return ups;
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
  const username = 'user' + Math.random() * 100;
  const password = 'password';

  await request(server).post('/auth/register').send({
    username,
    password,
    name: 'agjsdagba',
    surname: 'bgsgasgdg',
    locationId: 'ChIJOS9xY7KCVUcROAbIlRA1s9E',
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

export type SimplifiedFind = Partial<Omit<FindAppointmentsDto, 'filters'>> & {
  filters?: Partial<AppointmentFilters>;
};

export function createFindAppointmentDto(find: SimplifiedFind) {
  const dto: FindAppointmentsDto = {
    filters: {
      age: null,
      canceled: null,
      maxDate: null,
      maxDistance: null,
      maxPrice: null,
      maxTime: null,
      minDate: null,
      minTime: null,
      organizerId: null,
      skip: null,
      sportId: null,
      take: null,
      userId: null,
      ...find.filters,
    },
    ordering: find.ordering ?? null,
    userLocation: find.userLocation ?? null,
  };
  return dto;
}

export function toPostgresDateString(date: Date) {
  return date.toDateString().substring(4);
}

export function toPostgresTimeString(date: Date) {
  return date.toTimeString().substring(0, 5);
}
