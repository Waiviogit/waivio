import { createSelector } from 'reselect';
// selector
export const getQuotesState = state => state.quotes;
// reselect function
export const makeGetQuoteState = () =>
  createSelector(
    getQuotesState,
    (state, props) => props.quoteSecurity,
    (quotes, quoteSecurity) => quotes[quoteSecurity],
  );
export const makeGetPostQuoteState = () =>
  createSelector(
    getQuotesState,
    (state, quoteSecurity) => quoteSecurity,
    (quotes, quoteSecurity) => quotes[quoteSecurity],
  );
