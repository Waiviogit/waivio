import { isEmpty } from 'lodash';

export const prepareData = forecasts => {
  const forecastData = [['', '']];
  forecasts.forEach(forecast => {
    forecastData.push([forecast.name, forecast.count]);
  });
  return forecastData;
};

export const prepareInstrumentsData = (quotes, statData) =>
  statData.map(instrument => ({
    ...instrument,
    name: quotes[instrument.quote].name,
    wobjData: quotes[instrument.quote].wobjData,
    market: quotes[instrument.quote].market,
  }));

export const getIsBeaxyUser = (user, isGuest) =>
  isGuest && !isEmpty(user) && user.provider === 'beaxy';
