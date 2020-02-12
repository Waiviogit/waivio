import {size, map} from 'lodash';
import { createSelector } from 'reselect';
import { getQuotesSettingsState } from './quotesSettingsSelectors';
import { blackListQuotes } from '../../constants/blackListQuotes';
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

export const makeGetInstrumentsDropdownOptions = () =>
  createSelector(getQuotesState, getQuotesSettingsState, (quotes, quotesSettings) => {
    const optionsQuote = [];
    if (size(quotesSettings) !== 0) {
      map(quotesSettings, (item, key) => {
        if (quotes[key] && Number(quotes[key].askPrice) !== 0 && !blackListQuotes.includes(key)) {
          optionsQuote.push({ value: key, label: item.name });
        }
      });
    }
    return optionsQuote;
  });
