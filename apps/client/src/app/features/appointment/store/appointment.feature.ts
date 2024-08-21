import { createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { AppointmentDto } from '@rwa/shared';
import { filtersChanged } from '../../filters/store/filter.actions';
import {
  createAppointmentSuccess,
  loadAppointmentsSuccess,
  loadMyAppointmentsSuccess,
  updateAppointmentSuccess,
} from './appointment.actions';

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
    },
    on(loadMyAppointmentsSuccess, (state, action) => {
      return {
        ...state,
        myAppointments: myAppointmentsAdapter.addMany(
          action.data,
          state.myAppointments
        ),
      };
    }),
    on(createAppointmentSuccess, (state, action) => {
      return {
        ...state,
        myAppointments: myAppointmentsAdapter.addOne(
          action.data,
          state.myAppointments
        ),
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
