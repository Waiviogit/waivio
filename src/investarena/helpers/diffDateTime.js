import _ from "lodash";
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

export function getLongTermStatisticsFromWidgets(data, intl, quote) {
  const priceNow = quote.askPrice;
  const longTermStatistics = {};
  const calcAndSetPrice = (priceBefore, period, defaultMessage) => {
  const price = (priceNow - priceBefore) / priceBefore * 100;
  longTermStatistics[period] = {
    price: `${price.toFixed(2)}%`,
    label: intl.formatMessage({id: `longTermData_${period}`, defaultMessage}),
    isUp: price >= 0
  };
  };
  if(priceNow) {
    _.forEach(data, (tradeData, index) => {
      if (tradeData.L) {
        switch (index) {
          case 0:
            calcAndSetPrice(tradeData.L, 'd1', '1d');
            break;
          case 6:
            calcAndSetPrice(tradeData.L, 'd7', '1w');
            break;
          case 29:
            calcAndSetPrice(tradeData.L, 'm1', '1m');
            break;
          case 89:
            calcAndSetPrice(tradeData.L, 'm3', '3m');
            break;
          case 179:
            calcAndSetPrice(tradeData.L, 'm6', '6m');
            break;
          case 364:
            calcAndSetPrice(tradeData.L, 'm12', '1y');
            break;
          case 728:
            calcAndSetPrice(tradeData.L, 'm24', '2y');
            break;
          default:
            break;
        }
      }
    });
  }
  return longTermStatistics;
}
