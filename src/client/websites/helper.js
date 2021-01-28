import { get, isArray } from 'lodash';
import { message } from 'antd';

import { subscribeMethod, subscribeTypes } from '../../common/constants/blockTypes';

export const getAvailableStatus = status => {
  switch (status) {
    case 200:
      return {
        intl: { defaultMessage: 'Available', id: 'available' },
        status,
      };
    case 409:
      return {
        intl: { defaultMessage: 'Subdomain already exists', id: 'subdomain_already_exists' },
      };
    default:
      return null;
  }
};

export const getConfigFieldsValue = (obj, values) => {
  const array = isArray(obj) ? obj : Object.keys(obj);

  return array.reduce(
    (acc, curr) => ({
      ...acc,
      ...(values[curr] ? { [curr]: get(values, curr) } : {}),
    }),
    {},
  );
};

export const getChangesInAccessOption = (
  blockNum,
  username,
  host,
  currentActionType,
  processingFunction,
  meta,
) => (dispatch, getState, { busyAPI }) => {
  busyAPI.instance.sendAsync(subscribeMethod, [username, blockNum, subscribeTypes.posts]);
  busyAPI.instance.subscribe((response, mess) => {
    if (subscribeTypes.posts === mess.type && mess.notification.blockParsed === blockNum) {
      processingFunction(host, username)
        .then(res => {
          dispatch({
            type: currentActionType.SUCCESS,
            payload: res,
            meta,
          });
          return res;
        })
        .catch(() => {
          message.error('Something went wrong');
          dispatch({
            type: currentActionType.ERROR,
          });
        });
    }
  });
};

export default null;
