import { createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { AppointmentDto } from '@rwa/shared';
import { filtersChanged } from '../../filters/store/filter.actions';
import {
  createAppointmentSuccess,
  loadAppointmentsFail,
  loadAppointmentsSuccess,
  loadMyAppointmentsSuccess,
  updateAppointmentSuccess,
} from './appointment.actions';
import {
  joinAppointmentSuccess,
  leaveAppointment,
  rejectParticipation,
} from '../../participation/store/participation.actions';

const myAppointmentsAdapter = createEntityAdapter<AppointmentDto>();
const allAppointmentsAdapter = createEntityAdapter<AppointmentDto>();
export interface PaginationInfo {
  pageSize: number;
  loadedPages: number;
}

export const appointmentFeature = createFeature({
  name: 'appointment',
  reducer: createReducer(
    {
      myAppointments: myAppointmentsAdapter.getInitialState(),
      allAppointments: allAppointmentsAdapter.getInitialState(),
      paginationInfo: {
        pageSize: 5,
        loadedPages: 0,
      },
      isLoading: {
        val: false,
        shaker: 0,
      },
    },
    on(loadMyAppointmentsSuccess, (state, action) => {
      return {
        ...state,
        myAppointments: myAppointmentsAdapter.addMany(
          action.data,
          state.myAppointments
        ),
        isLoading: {
          val: false,
          shaker: Math.random(),
        },
      };
    }),
    on(createAppointmentSuccess, (state, action) => {
      return {
        ...state,
        myAppointments: myAppointmentsAdapter.addOne(
          action.data,
          state.myAppointments
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
        myAppointments: myAppointmentsAdapter.updateOne(
          { id, changes },
          state.myAppointments
        ),
        isLoading: {
          val: false,
          shaker: Math.random(),
        },
      };
    }),
    on(filtersChanged, (state, action) => {
      return {
        ...state,
        paginationInfo: {
          ...state.paginationInfo,
          loadedPages: 0,
        },
        allAppointments: allAppointmentsAdapter.removeAll(
          state.allAppointments
        ),
      };
    }),
    on(loadAppointmentsSuccess, (state, action) => {
      return {
        ...state,
        paginationInfo: {
          ...state.paginationInfo,
          loadedPages: state.paginationInfo.loadedPages + 1,
        },
        allAppointments: allAppointmentsAdapter.addMany(
          action.data,
          state.allAppointments
        ),
        isLoading: {
          val: false,
          shaker: Math.random(),
        },
      };
    }),
    on(loadAppointmentsFail, (state, action) => {
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
        state.allAppointments.entities[action.data.appointmentId];

      if (appointment == undefined) {
        throw `Can't find appointment`;
      }

      return {
        ...state,
        allAppointments: allAppointmentsAdapter.updateOne(
          {
            id: appointment.id,
            changes: {
              participants: [...appointment.participants, action.data],
            },
          },
          state.allAppointments
        ),
        isLoading: {
          val: false,
          shaker: Math.random(),
        },
      };
    }),
    on(leaveAppointment, (state, action) => {
      const appointment =
        state.allAppointments.entities[action.data.appointmentId];

      if (appointment == undefined) {
        throw `Can't find appointment`;
      }

      return {
        ...state,
        allAppointments: allAppointmentsAdapter.updateOne(
          {
            id: appointment.id,
            changes: {
              participants: appointment.participants.filter(
                (participation) =>
                  participation.id != action.data.participationId
              ),
            },
          },
          state.allAppointments
        ),
      };
    }),
    on(rejectParticipation, (state, action) => {
      const appointment =
        state.allAppointments.entities[action.data.appointmentId];

      if (appointment == undefined) {
        throw `Can't find appointment`;
      }

      const participationIndex = appointment.participants.findIndex(
        (participation) => participation.id == action.data.participationId
      );

      if (participationIndex == -1) {
        `Can't find participation`;
      }

      const participants = [...appointment.participants];
      participants[participationIndex] = {
        ...participants[participationIndex],
        approved: false,
      };

      return {
        ...state,
        allAppointments: allAppointmentsAdapter.updateOne(
          {
            id: appointment.id,
            changes: {
              participants: participants,
            },
          },
          state.allAppointments
        ),
      };
    })
  ),
  extraSelectors: ({ selectMyAppointments, selectAllAppointments }) => {
    const selectAllMyAppointments = createSelector(
      selectMyAppointments,
      (state) => {
        return myAppointmentsAdapter.getSelectors().selectAll(state);
      }
    );

    const selectAllAllAppointments = createSelector(
      selectAllAppointments,
      (state) => {
        return allAppointmentsAdapter.getSelectors().selectAll(state);
      }
    );

    const selectAppointmentById = (id: number) => {
      return createSelector(
        selectMyAppointments,
        (state) => state.entities[id]
      );
    };

    return {
      selectMyAppointments: selectAllMyAppointments,
      selectAllAppointments: selectAllAllAppointments,
      selectAppointmentById,
    };
  },
});
