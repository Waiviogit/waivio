import moment from 'moment';

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

export default null;
