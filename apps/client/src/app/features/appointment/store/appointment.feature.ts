import { createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { AppointmentDto } from '@rwa/shared';
import {
  createAppointmentSuccess,
  loadMyAppointmentsSuccess,
  updateAppointmentSuccess,
} from './appointment.actions';

const myApppointmentsAdapter = createEntityAdapter<AppointmentDto>();

export const appointmentFeature = createFeature({
  name: 'appointment',
  reducer: createReducer(
    {
      myAppointments: myApppointmentsAdapter.getInitialState(),
    },
    on(loadMyAppointmentsSuccess, (state, action) => {
      return {
        myAppointments: myApppointmentsAdapter.addMany(
          action.data,
          state.myAppointments
        ),
      };
    }),
    on(createAppointmentSuccess, (state, action) => {
      return {
        myAppointments: myApppointmentsAdapter.addOne(
          action.data,
          state.myAppointments
        ),
      };
    }),
    on(updateAppointmentSuccess, (state, action) => {
      const { id, ...changes } = action.data;
      return {
        myAppointments: myApppointmentsAdapter.updateOne(
          { id, changes },
          state.myAppointments
        ),
      };
    })
  ),
  extraSelectors: ({ selectMyAppointments }) => {
    const selectAllMyAppointments = createSelector(
      selectMyAppointments,
      (state) => {
        return myApppointmentsAdapter.getSelectors().selectAll(state);
      }
    );

    const selectAppointmentById = (id: number) => {
      return createSelector(
        selectMyAppointments,
        (state) => state.entities[id]
      );
    };

    return {
      selectAllMyAppointments,
      selectAppointmentById,
    };
  },
});
