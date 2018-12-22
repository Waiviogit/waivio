import _ from 'lodash';
import Cookies from 'js-cookie';

const localStorageData = [
  'sid',
  'stompUser',
  'stompPassword',
  'um_session',
  'broker_id',
  'WEBSRV',
  'token',
  'accounts',
  'email',
];

export function setLocalStorageBroker(platformName, data) {
  _.forEach(data, (item, key) => {
    if (localStorageData.includes(key) && key === 'accounts') {
      localStorage.setItem(key, JSON.stringify(item));
    } else if (localStorageData.includes(key)) {
      localStorage.setItem(key, item);
    }
  });
  Cookies.set('platformName', platformName);
}
