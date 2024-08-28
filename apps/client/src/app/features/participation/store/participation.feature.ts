import { createEntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { ParticipationDto, AppointmentDto } from '@rwa/shared';
import {
  joinAppointmentSuccess,
  leaveAppointment,
  loadMyParticipationsSuccess,
  markChangesAsSeen,
  showParticipants,
} from './participation.actions';

const adapter = createEntityAdapter<ParticipationDto>();

export const participationFeature = createFeature({
  name: 'participation',
  reducer: createReducer(
    adapter.getInitialState({
      selectedAppointmentId: null as number | null,
    }),
    on(loadMyParticipationsSuccess, (state, action) => {
      return adapter.addMany(action.data, adapter.removeAll(state));
    }),
    on(joinAppointmentSuccess, (state, action) => {
      return adapter.addOne(action.data, state);
    }),
    on(leaveAppointment, (state, action) => {
      return adapter.removeOne(action.data.participationId, state);
    }),
    on(markChangesAsSeen, (state, action) => {
      return adapter.updateOne(
        {
          id: action.participationId,
          changes: {
            userHasSeenChanges: true,
          },
        },
        state
      );
    }),
    on(showParticipants, (state, action) => {
      return {
        ...state,
        selectedAppointmentId: action.data.id,
      };
    })
    // on(rejectParticipation, (state, action) => {
    //   return adapter.updateOne(
    //     { id: action.data.participationId, changes: { approved: false } },
    //     state
    //   );
    // })
  ),
  extraSelectors: ({ selectParticipationState }) => {
    const selectAll = createSelector(selectParticipationState, (state) => {
      return adapter.getSelectors().selectAll(state);
    });

    const selectChangesCount = createSelector(selectAll, (participations) => {
      return participations.filter(
        (participation) => !participation.userHasSeenChanges
      ).length;
    });

    return {
      selectAll,
      selectChangesCount,
    };
  },
});

// const participation = state.ids
//   .map((id) => state.entities[id])
//   .find((participation) => {
//     return (
//       participation!.appointmentId == action.data.appointmentId &&
//       participation!.userId == action.data.userId
//     );
//   });

// if (participation == undefined) {
//   throw `Can't find participation`;
// }

// const participation = state.ids
//   .map((id) => state.entities[id])
//   .find((participation) => {
//     return (
//       participation!.appointmentId == action.data.appointmentId &&
//       participation!.userId == action.data.userId
//     );
//   });

// if (participation == undefined) {
//   throw `Can't find participation`;
// }
