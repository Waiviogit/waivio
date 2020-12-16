import { get, isArray } from 'lodash';
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
) => (dispatch, getState, { busyAPI }) => {
  busyAPI.sendAsync(subscribeMethod, [username, blockNum, subscribeTypes.posts]);
  busyAPI.subscribe((response, mess) => {
    if (subscribeTypes.posts === mess.type && mess.notification.blockParsed === blockNum) {
      processingFunction(host, username)
        .then(res => {
          dispatch({
            type: currentActionType.SUCCESS,
            payload: res,
          });
          return res;
        })
        .catch(() =>
          dispatch({
            type: currentActionType.ERROR,
          }),
        );
    }
  });
};

export default null;
