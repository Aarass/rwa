import { IntervalDto } from '@rwa/shared';

export function toPostgresDateString(date: Date) {
  return date.toDateString().substring(4);
}

export function toPostgresTimeString(date: Date) {
  return date.toTimeString().substring(0, 5);
}

export function toPostgresIntervalString(instance: IntervalDto) {
  let postgresString = '';

  if (instance.hours) {
    if (postgresString.length) {
      postgresString += ' ';
    }

    postgresString +=
      instance.hours === 1
        ? instance.hours + ' hour'
        : instance.hours + ' hours';
  }

  if (instance.minutes) {
    if (postgresString.length) {
      postgresString += ' ';
    }

    postgresString +=
      instance.minutes === 1
        ? instance.minutes + ' minute'
        : instance.minutes + ' minutes';
  }

  return postgresString === '' ? '0' : postgresString;
}

export function dateDateFromPostgresString(date: string) {
  return new Date(date);
}

export function timeDateFromPostgresString(time: string) {
  return new Date(Date.parse(`01 Jan 1970 ${time}`));
}

export function roundTime(date: Date) {
  date.setMinutes(Math.round(date.getMinutes() / 10) * 10);
  return date;
}

// (() => {
//   const date = new Date(Date.parse(`01 Jan 1970 ${'15:58'}`));
//   console.log(roundTime(date));
// })();
