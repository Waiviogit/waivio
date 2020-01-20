import _ from 'lodash';
import moment from 'moment';
import { currentTime } from './currentTime';
import { forecastDateTimeFormat } from '../constants/constantsForecast';

export function localeDate(date, locale) {
  const dateFormat = {
    day: date.includes('DD') ? 'DD' : '',
    month: date.includes('MM') ? 'MM' : '',
    year: date.includes('YYYY') ? 'YYYY' : '',
    time: date.includes('HH:mm') ? 'HH:mm' : '',
  };
  let dateArray = [];
  if (locale === 'ru') {
    dateArray = [dateFormat.day, dateFormat.month, dateFormat.year];
  } else {
    dateArray = [dateFormat.year, dateFormat.month, dateFormat.day];
  }
  return `${dateArray.filter(item => !!item).join('/')} ${dateFormat.time}`.trim();
}
export function calculateTime(timeValue) {
  let calculatedTime = Math.floor(timeValue / 1000);
  const seconds = calculatedTime % 60;
  calculatedTime = Math.floor((calculatedTime /= 60));
  const minutes = calculatedTime % 60;
  calculatedTime = Math.floor((calculatedTime /= 60));
  const hours = calculatedTime % 24;
  calculatedTime = Math.floor((calculatedTime /= 24));
  return {
    seconds,
    minutes,
    hours,
    days: calculatedTime,
  };
}
export function timeExpired(forecastTime, lang) {
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
export function timeForecastRemain(forecastTime) {
  const dateForecast = parseInt(moment.utc(forecastTime).format('x'), 10);
  const diff = dateForecast - currentTime.getTime();
  if (diff > 0) {
    const timeValues = calculateTime(diff);
    const resultValues = `${timeValues.hours}:${timeValues.minutes}:${timeValues.seconds}`;
    return `${timeValues.days}d ${moment(resultValues, 'HH:mm:ss').format('HH:mm:ss')}`;
  }
  return `0d 00:00:00`;
}

export function timeQuickForecastRemain(forecastTime) {
  const dateForecast = parseInt(moment.utc(forecastTime).format('x'), 10);
  const diff = dateForecast - currentTime.getTime();
  if (diff > 0) {
    const timeValues = calculateTime(diff);
    const resultValues = `${timeValues.hours}h ${timeValues.minutes}m ${timeValues.seconds}s`;
    return `${moment(resultValues, 'HH:mm:ss').format('HH:mm:ss')}`;
  }
  return `finished`;
}

// "2019-01-30T17:58:38.000Z"
export function getDataCreatedAt() {
  const periodBefore = 692118400;
  const nowDate = Date.now();
  return moment(nowDate - periodBefore).format(forecastDateTimeFormat);
}
export function getDataForecast() {
  const periodAfter = 604800;
  const nowDate = Date.now();
  return moment.utc(nowDate + periodAfter).format(forecastDateTimeFormat);
}

export function getLongTermStatisticsForUser(data) {
  const longTermStatistics = {};
  const formatData = (period, price, defaultMessage) => {
    if (period && price !== null) {
      longTermStatistics[period] = {
        price: `${price.toFixed(2)}%`,
        label: defaultMessage,
        intlId: `longTermData_${period}`,
        isUp: price >= 0,
      };
    }
  };
  if (data) {
    _.mapKeys(data, (value, key) => {
      if (key) {
        switch (key) {
          case 'd1':
            formatData('d1', value, '1d');
            break;
          case 'd7':
            formatData('d7', value, '1w');
            break;
          case 'm1':
            formatData('m1', value, '1m');
            break;
          case 'm3':
            formatData('m3', value, '3m');
            break;
          case 'm6':
            formatData('m6', value, '6m');
            break;
          case 'm12':
            formatData('m12', value, '1y');
            break;
          case 'm24':
            formatData('m24', value, '2y');
            break;
          default:
            break;
        }
      }
    });
  }
  return longTermStatistics;
}
