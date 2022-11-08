import { createSelector } from 'reselect';

// selector
export const optionsState = state => state.options;

// reselect function
export const getActiveOption = createSelector([optionsState], state => state.activeOption);
