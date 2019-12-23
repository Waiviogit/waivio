import moment from 'moment';
import { get, isEmpty, last } from 'lodash';
import { jsonParse } from './formatter';

export const isValidForecast = forecast => {
  let isValid = true;
  ['quoteSecurity', 'postPrice', 'recommend', 'expiredAt', 'createdAt'].forEach(field => {
    if (!forecast || forecast[field] === undefined || forecast[field] === null) isValid = false;
  });
  if (!isValid) return false;
  if (moment.utc(moment(forecast.expiredAt).diff(moment(forecast.createdAt))) < 0) return false;
  if (
    forecast &&
    (forecast.recommend !== 'Buy' || forecast.recommend !== 'Sell') &&
    typeof forecast.postPrice !== 'number'
  )
    isValid = false;

  return isValid;
};

export const getForecastData = post => {
  const forecast = post && post.forecast || get(jsonParse(post.json_metadata), 'wia', null);
  if (forecast) {
    const { quoteSecurity, postPrice, recommend, createdAt, tpPrice, slPrice } = forecast;
    const predictedEndDate = forecast.expiredAt;
    const isForecastExpired = !isEmpty(post.exp_forecast) || moment().valueOf() > moment(predictedEndDate).valueOf();
    const { expiredAt, bars, profitability } = get(post, ['exp_forecast'], {});

    return {
      predictedEndDate,
      quoteSecurity,
      postPrice,
      createdAt,
      buyOrSell: recommend,
      tpPrice: tpPrice ? tpPrice.toString() : null,
      slPrice: slPrice ? slPrice.toString() : null,
      isForecastExpired,
      expiredBars: bars || [],
      finalQuote: last(bars) || null,
      expiredAt,
      profitability: profitability || 0,
      isForecastValid: isValidForecast(forecast),
    }
  }
  return {
    isForecastValid: false,
  };
};

export default null;
