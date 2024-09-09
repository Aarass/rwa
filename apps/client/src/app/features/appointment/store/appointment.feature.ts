import { createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { AppointmentDto } from '@rwa/shared';
import { logout } from '../../auth/store/auth.actions';
import {
  joinAppointmentSuccess,
  leaveAppointment,
  rejectParticipation,
} from '../../participation/store/participation.actions';
import {
  addAppointment,
  cancelAppointment,
  createAppointmentSuccess,
  loadAppointmentsFail,
  loadAppointmentsSuccess,
  reloadAppointments,
  removeAppointment,
  updateAppointmentSuccess,
} from './appointment.actions';

const adapter = createEntityAdapter<AppointmentDto>();
export interface PaginationInfo {
  pageSize: number;
  loadedPages: number;
}

export const appointmentFeature = createFeature({
  name: 'appointment',
  reducer: createReducer(
    {
      appointments: adapter.getInitialState(),
      paginationInfo: {
        pageSize: 5,
        loadedPages: 0,
      },
      isLoading: {
        val: true,
        shaker: 0,
      },
    },
    on(createAppointmentSuccess, (state, action) => {
      return {
        ...state,
        appointments: adapter.addOne(
          { ...action.data, participants: [] },
          state.appointments
        ),
        isLoading: {
          val: false,
          shaker: Math.random(),
        },
      };
    }),
    on(updateAppointmentSuccess, (state, action) => {
      const { id, ...changes } = action.data;
      return {
        ...state,
        appointments: adapter.updateOne({ id, changes }, state.appointments),
        isLoading: {
          val: false,
          shaker: Math.random(),
        },
      };
    }),
    on(cancelAppointment, (state, action) => {
      return {
        ...state,
        appointments: adapter.updateOne(
          {
            id: action.data.id,
            changes: {
              canceled: true,
            },
          },
          state.appointments
        ),
      };
    }),
    on(reloadAppointments, (state) => {
      return {
        ...state,
        paginationInfo: {
          ...state.paginationInfo,
          loadedPages: 0,
        },
        appointments: adapter.removeAll(state.appointments),
      };
    }),
    on(loadAppointmentsSuccess, (state, action) => {
      return {
        ...state,
        paginationInfo: {
          ...state.paginationInfo,
          loadedPages: state.paginationInfo.loadedPages + 1,
        },
        appointments: adapter.addMany(action.data, state.appointments),
        isLoading: {
          val: false,
          shaker: Math.random(),
        },
      };
    }),
    on(loadAppointmentsFail, (state) => {
      return {
        ...state,
        isLoading: {
          val: false,
          shaker: Math.random(),
        },
      };
    }),
    on(joinAppointmentSuccess, (state, action) => {
      const appointment =
        state.appointments.entities[action.data.appointmentId];

      if (appointment === undefined) {
        throw `Can't find appointment`;
      }

      return {
        ...state,
        appointments: adapter.updateOne(
          {
            id: appointment.id,
            changes: {
              participants: [...appointment.participants, action.data],
            },
          },
          state.appointments
        ),
        isLoading: {
          val: false,
          shaker: Math.random(),
        },
      };
    }),
    on(leaveAppointment, (state, action) => {
      const appointment =
        state.appointments.entities[action.data.appointmentId];

      if (appointment === undefined) {
        throw `Can't find appointment`;
      }

      return {
        ...state,
        appointments: adapter.updateOne(
          {
            id: appointment.id,
            changes: {
              participants: appointment.participants.filter(
                (participation) =>
                  participation.id != action.data.participationId
              ),
            },
          },
          state.appointments
        ),
      };
    }),
    on(rejectParticipation, (state, action) => {
      const appointment =
        state.appointments.entities[action.data.appointmentId];

      if (appointment === undefined) {
        throw `Can't find appointment`;
      }

      const participationIndex = appointment.participants.findIndex(
        (participation) => participation.id === action.data.participationId
      );

      if (participationIndex === -1) {
        `Can't find participation`;
      }

      const participants = [...appointment.participants];
      participants[participationIndex] = {
        ...participants[participationIndex],
        approved: false,
      };

      return {
        ...state,
        appointments: adapter.updateOne(
          {
            id: appointment.id,
            changes: {
              participants: participants,
            },
          },
          state.appointments
        ),
      };
    }),
    on(addAppointment, (state, action) => {
      return {
        ...state,
        appointments: adapter.addOne(action.data, state.appointments),
      };
    }),
    on(removeAppointment, (state, action) => {
      return {
        ...state,
        appointments: adapter.removeOne(action.id, state.appointments),
      };
    }),
    on(logout, (state) => {
      return {
        ...state,
        appointments: adapter.removeAll(state.appointments),
        isLoading: {
          val: false,
          shaker: Math.random(),
        },
        paginationInfo: {
          loadedPages: 0,
          pageSize: 0,
        },
      };
    })
  ),
  extraSelectors: ({ selectAppointments }) => {
    const selectAllAppointments = createSelector(
      selectAppointments,
      (state) => {
        return adapter.getSelectors().selectAll(state);
      }
    );

    const selectAppointmentById = (id: number) => {
      return createSelector(selectAppointments, (state) => state.entities[id]);
    };

    return {
      selectAllAppointments,
      selectAppointmentById,
    };
  },
});
