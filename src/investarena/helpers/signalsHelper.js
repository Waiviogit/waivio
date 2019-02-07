import _ from 'lodash';
import { calculateTime } from './diffDateTime';

export const formatSignalsData = signals => {
  return _.orderBy(
    _.map(signals, signal => {
      return {
        quote: signal.symbolcode,
        id: signal.resultuid,
        strength: signal.quality,
        interval: signal.interval,
        breakout: signal.breakout,
        clarity: signal.clarity,
        initialtrend: signal.initialtrend,
        uniformity: signal.uniformity,
        recommendation: signal.direction === 1 ? 'buy' : 'sell',
      };
    }),
    ['strength'],
    ['desc'],
  );
};

export const getCorrectValue = value => {
  return {
    value: value ? value + '/10' : 'N/A',
    color: value > 4 ? (value > 7 ? 'success' : 'info') : 'danger',
  };
};
export const getCorrectTime = (interval, intl) => {
  let shortTime = '';
  const timeObject = calculateTime(Number(interval) * 60 * 1000);
  shortTime +=
    timeObject.days !== 0 ? timeObject.days + intl.formatMessage({ id: 'signal.days' }) : '';
  shortTime +=
    timeObject.hours !== 0 ? timeObject.hours + intl.formatMessage({ id: 'signal.hours' }) : '';
  shortTime +=
    timeObject.minutes !== 0
      ? timeObject.minutes + intl.formatMessage({ id: 'signal.minutes' })
      : '';
  shortTime +=
    timeObject.seconds !== 0
      ? timeObject.seconds + intl.formatMessage({ id: 'signal.seconds' })
      : '';
  return shortTime;
};
