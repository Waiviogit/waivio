import { createSelector } from 'reselect';
// selector
export const getQuotesSettingsState = state => state.quotesSettings;
// reselect function
export const makeGetQuoteSettingsState = () =>
  createSelector(
    getQuotesSettingsState,
    (state, props) => props.quoteSecurity,
    (quotesSettings, quoteSecurity) => quotesSettings[quoteSecurity],
  );
