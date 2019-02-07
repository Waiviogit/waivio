import _ from 'lodash';
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

export const makeGetQuotesSettingsState = () =>
  createSelector(
    getQuotesSettingsState,
    (state, props) => props.quoteSecurities,
    (quotesSettings, quoteSecurities) =>
      _.toPairs(
        Object.keys(quotesSettings)
          .filter(key => quoteSecurities.includes(key))
          .reduce((obj, key) => {
            return {
              ...obj,
              [key]: quotesSettings[key],
            };
          }, {}),
      ),
  );
