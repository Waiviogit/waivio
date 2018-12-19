import Base from './Base';
import config from '../configApi/config';
import { formatSignalsData } from '../helpers/signalsHelper';

const parseSignals = (signals, quote) => {
  if (signals[quote]) {
    return Promise.resolve(formatSignalsData(signals[quote]));
  }
  return Promise.resolve();
};

export default class Signals extends Base {
  getSignals(quote) {
    return this.apiClient.get(config.signals.getSignals, {}, {}).then(response => {
      if (response.data) {
        return parseSignals(response.data, quote);
      }
    });
  }
  getAllSignals() {
    return this.apiClient.get(config.signals.getSignals, {}, {});
  }
}
