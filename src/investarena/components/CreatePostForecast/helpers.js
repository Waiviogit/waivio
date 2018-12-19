import _ from 'lodash';
import { blackListQuotes } from '../../constants/blackListQuotes';

export const getQuoteOptions = (quotesSettings, quotes) => {
  const optionsQuote = [];
  if (_.size(quotesSettings) !== 0) {
    _.map(quotesSettings, (item, key) => {
      if (quotes[key] && Number(quotes[key].askPrice) !== 0 && !blackListQuotes.includes(key)) {
        optionsQuote.push({ value: key, label: item.name });
      }
    });
  }
  return optionsQuote;
};

export const getQuotePrice = (quote, recommend, quoteList) => {
  let quotePrice = null;
  if (quote && recommend === 'Buy' && quoteList[quote]) {
    quotePrice = quoteList[quote].askPrice;
  } else if (quote && recommend === 'Sell' && quoteList[quote]) {
    quotePrice = quoteList[quote].bidPrice;
  }
  return quotePrice;
};

export const isStopLossTakeProfitValid = (value, input, recommend, quotePrice) => {
  if (value === '') return false;
  const price = Number(quotePrice);
  let isError = value.length > 8;
  switch (recommend) {
    case 'Buy':
      isError =
        input === 'takeProfitValue'
          ? Number(value) <= price || isError
          : Number(value) >= price || isError;
      break;
    case 'Sell':
      isError =
        input === 'takeProfitValue'
          ? Number(value) >= price || isError
          : Number(value) <= price || isError;
      break;
    default:
      break;
  }
  return isError || Number(value) <= 0;
};

export default null;
