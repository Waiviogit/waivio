import { get, isEmpty } from 'lodash';
import moment from 'moment';
import { forecastDateTimeFormat } from '../../constants/constantsForecast';
import { optionsForecast } from '../../constants/selectData';

export const getQuotePrice = (recommend, quoteSelected) => {
  if (!quoteSelected) return null;
  const { askPrice, bidPrice } = quoteSelected;
  switch (recommend) {
    case 'Buy':
      return !isNaN(askPrice) ? parseFloat(askPrice) : null;
    case 'Sell':
      return !isNaN(bidPrice) ? parseFloat(bidPrice) : null;
    default:
      return null;
  }
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

const getExpiredAt = (selectForecast, forecastExpiredAt) => {
  const minForecastDuration = optionsForecast[0].value;
  const minimalForecastUTC = moment.utc().add(minForecastDuration, 'seconds');
  const currentForecastUTC = moment(forecastExpiredAt).utc();
  const isExpiredAtValid = currentForecastUTC > minimalForecastUTC;

  switch (selectForecast) {
    case 'Custom':
      return isExpiredAtValid ? currentForecastUTC : minimalForecastUTC;
    case '900':
    case '1800':
    case '3600':
    case '14400':
    case '28800':
    case '86400':
    case '604800':
    case '1555200':
    case '1814400':
      return moment
        .utc()
        .add(selectForecast, 'seconds')
        .format(forecastDateTimeFormat);
    default:
      return minimalForecastUTC.format(forecastDateTimeFormat);
  }
};

export const getForecastObject = (forecast, selectForecast, isExpired = false) => {
  if (isExpired) return forecast;
  return forecast && selectForecast && !isEmpty(forecast)
    ? {
        ...forecast,
        createdAt: moment.utc().format(forecastDateTimeFormat),
        expiredAt: getExpiredAt(selectForecast, forecast.expiredAt),
        tpPrice: forecast.tpPrice ? parseFloat(forecast.tpPrice) : null,
        slPrice: forecast.slPrice ? parseFloat(forecast.slPrice) : null,
      }
    : null;
};

export const validateForm = (quote, recommend, forecast, tpError, slError) =>
  !!(quote && recommend && forecast && !tpError && !slError) || !(quote || recommend || forecast);

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

export const getEditorForecast = (forecast, quotesSettings) => {
  const {
    selectQuote,
    selectRecommend,
    selectForecast,
    dateTimeValue,
    quotePrice,
    stopLossValue,
    takeProfitValue,
    takeProfitValueIncorrect,
    stopLossValueIncorrect,
  } = forecast;
  const quoteSettings = get(quotesSettings, [selectQuote], null);
  const price = parseFloat(quotePrice);
  const forecastObject = {
    quoteSecurity: selectQuote,
    market: quoteSettings && quoteSettings.market,
    recommend: selectRecommend,
    postPrice: !isNaN(price) ? price : null,
    selectForecast,
    expiredAt: dateTimeValue ? dateTimeValue.format(forecastDateTimeFormat) : null,
    isValid: validateForm(
      selectQuote,
      selectRecommend,
      selectForecast,
      takeProfitValueIncorrect,
      stopLossValueIncorrect,
    ),
    wobjData: quoteSettings && { ...quoteSettings.wobjData, name: quoteSettings.name },
  };
  if (takeProfitValue) forecastObject.tpPrice = takeProfitValue;
  if (stopLossValue) forecastObject.slPrice = stopLossValue;
  return forecastObject;
};

export default null;
