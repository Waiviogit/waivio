import moment from 'moment';
import { currentTime } from './currentTime';

export function localeDate (date, locale) {
  const dateFormat = {
    day: date.includes('DD') ? 'DD' : '',
    month: date.includes('MM') ? 'MM' : '',
    year: date.includes('YYYY') ? 'YYYY' : '',
    time: date.includes('HH:mm') ? 'HH:mm' : ''
  };
  let dateArray = [];
  if (locale === 'ru') {
    dateArray = [dateFormat.day, dateFormat.month, dateFormat.year];
  } else {
    dateArray = [dateFormat.year, dateFormat.month, dateFormat.day];
  }
  return (`${dateArray.filter(item => !!item).join('/')  } ${dateFormat.time}`).trim();
}
export function calculateTime (timeValue) {
  let calculatedTime = Math.floor(timeValue / 1000);
  const seconds = calculatedTime % 60;
  calculatedTime = Math.floor(calculatedTime /= 60);
  const minutes = calculatedTime % 60;
  calculatedTime = Math.floor(calculatedTime /= 60);
  const hours = calculatedTime % 24;
  calculatedTime = Math.floor(calculatedTime /= 24);
  return {
    seconds,
    minutes,
    hours,
    days: calculatedTime
  };
}
export function timeExpired (forecastTime, lang) {
  let resultTime;
  const dateCreate = parseInt(moment.utc(forecastTime).format('x'), 10);
  const diff = Math.abs(currentTime.getTime() - dateCreate);
  const timeValues = calculateTime(diff);
  if (timeValues.years > 0) {
    resultTime = moment(forecastTime).format(localeDate('YYYY/MM/DD', lang));
  } else {
    resultTime = moment(forecastTime).format(localeDate('MM/DD HH:mm', lang));
  }
  return resultTime;
}
export function timeForecastRemain (forecastTime) {
  const dateForecast = parseInt(moment.utc(forecastTime).format('x'), 10);
  const diff = dateForecast - currentTime.getTime();
  if (diff > 0) {
    const timeValues = calculateTime(diff);
    const resultValues = `${timeValues.hours  }:${  timeValues.minutes  }:${  timeValues.seconds}`;
    return `${timeValues.days}d ${  moment(resultValues, 'HH:mm:ss').format('HH:mm:ss')}`;
  } 
    return `0d 00:00:00`;
  
}


