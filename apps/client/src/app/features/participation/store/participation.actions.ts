import { createAction, props } from '@ngrx/store';
import { AppointmentDto, ParticipationDto } from '@rwa/shared';

export const loadMyParticipations = createAction(
  '[Participation] Load My Participations'
);
export const loadMyParticipationsSuccess = createAction(
  '[Participation] Load My Participations Success',
  props<{ data: ParticipationDto[] }>()
);

// ------------------

export const joinAppointment = createAction(
  '[Participation] Join Appointment',
  props<{ appointmentId: number }>()
);
export const joinAppointmentSuccess = createAction(
  '[Participation] Join Appointment Success',
  props<{ data: ParticipationDto }>()
);
export const joinAppointmentFail = createAction(
  '[Participation] Join Appointment Fail',
  props<{ appointmentId: number }>()
);

// ------------------

export const leaveAppointment = createAction(
  '[Participation] Leave Appointment',
  props<{
    data: {
      participationId: number;
      appointmentId: number;
      userId: number;
    };
  }>()
);
// export const leaveAppointmentSuccess = createAction(
//   '[Participation] Leave Appointment Success',
//   props<{ appointmentId: number }>()
// );
// export const leaveAppointmentFail = createAction(
//   '[Participation] Leave Appointment Fail',
//   props<{ appointmentId: number }>()
// );

// -----------------

export const markChangesAsSeen = createAction(
  '[Participation] Mark Changes As Seen',
  props<{ participationId: number }>()
);

// -----------------

export const rejectParticipation = createAction(
  '[Participation] Reject Participation',
  props<{
    data: {
      participationId: number;
      appointmentId: number;
      userId: number;
    };
  }>()
);

// -----------------
export const showParticipants = createAction(
  '[Participation] Show Participants',
  props<{ data: AppointmentDto }>()
);
