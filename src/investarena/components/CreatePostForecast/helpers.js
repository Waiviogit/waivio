import _ from 'lodash';
import moment from 'moment';
import { blackListQuotes } from '../../constants/blackListQuotes';
import { forecastDateTimeFormat } from '../../constants/constantsForecast';

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

export const getForecastObject = (forecast, selectForecast) =>
  forecast && selectForecast && !_.isEmpty(forecast)
    ? {
        ...forecast,
        createdAt: moment.utc().format(forecastDateTimeFormat),
        expiredAt:
          selectForecast === 'Custom'
            ? moment(forecast.expiredAt).utc()
            : moment
                .utc()
                .add(selectForecast, 'seconds')
                .format(forecastDateTimeFormat),
        tpPrice: forecast.tpPrice ? parseFloat(forecast.tpPrice) : null,
        slPrice: forecast.slPrice ? parseFloat(forecast.slPrice) : null,
      }
    : null;

export const validateForm = (quote, recommend, forecast) =>
  !!(quote && recommend && forecast) || !(quote || recommend || forecast);

export const getForecastState = forecast => {
  const dateTimeValue = forecast.expiredAt ? moment(forecast.expiredAt).local() : null;
  const selectForecast =
    !forecast.selectForecast && Boolean(dateTimeValue) ? 'Custom' : forecast.selectForecast || null;
  return {
    dateTimeValue,
    quotePrice: forecast.postPrice || null,
    selectQuote: forecast.quoteSecurity || null,
    selectRecommend: forecast.recommend || null,
    selectForecast,
    takeProfitValue: forecast.tpPrice || '',
    stopLossValue: forecast.slPrice || '',
    isValid: validateForm(forecast.quoteSecurity, forecast.recommend, selectForecast),
  };
};

export default null;
