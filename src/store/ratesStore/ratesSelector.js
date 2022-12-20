import { createSelector } from 'reselect';

// selector
export const ratesState = state => state.rates;

// reselect function
export const getRatesList = createSelector([ratesState], state => state.rates);
