import { get } from 'lodash';
import { createSelector } from 'reselect';

// selector
export const swapState = state => state.swap;

// reselect function
export const getSwapListFromStore = createSelector([swapState], state =>
  get(state, 'swapList', {}),
);

export const getSwapListTo = createSelector([swapState], state => get(state, 'swapListTo', []));

export const getSwapListFrom = createSelector([swapState], state => get(state, 'swapListFrom', []));

export const getTokenTo = createSelector([swapState], state => get(state, 'to', ''));

export const getTokenFrom = createSelector([swapState], state => get(state, 'from', ''));

export const getVisibleModal = createSelector([swapState], state => get(state, 'visible', false));

export const getIsChanging = createSelector([swapState], state => get(state, 'isChanging', false));
