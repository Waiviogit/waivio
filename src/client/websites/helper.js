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
  meta,
) => (dispatch, getState, { busyAPI }) => {
  busyAPI.sendAsync(subscribeMethod, [username, blockNum, subscribeTypes.posts]);
  busyAPI.subscribe((response, mess) => {
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
        .catch(() =>
          dispatch({
            type: currentActionType.ERROR,
          }),
        );
    }
  });
};

// eslint-disable-next-line consistent-return
export const getCurrStyleAfterZoom = currentZoom => {
  if (currentZoom < 4 && currentZoom > 0) {
    return {
      transform: 'scale(0.2)',
      marginLeft: -150,
      marginTop: -140,
    };
  } else if (currentZoom === 4) {
    return {
      transform: 'scale(0.2)',
      marginLeft: -150,
      marginTop: -140,
    };
  } else if (currentZoom === 5) {
    return {
      transform: 'scale(0.3)',
      marginLeft: -150,
      marginTop: -140,
    };
  } else if (currentZoom === 6) {
    return {
      transform: 'scale(0.4)',
      marginLeft: -150,
      marginTop: -140,
    };
  } else if (currentZoom === 7) {
    return {
      transform: 'scale(0.5)',
      marginLeft: -150,
      marginTop: -140,
    };
  } else if (currentZoom === 8) {
    return {
      transform: 'scale(0.6)',
      marginLeft: -100,
      marginTop: -90,
    };
  } else if (currentZoom === 9) {
    return {
      transform: 'scale(0.7)',
      marginLeft: -70,
      marginTop: -60,
    };
  } else if (currentZoom === 10) {
    return {
      transform: 'scale(0.8)',
      marginLeft: -50,
      marginTop: -40,
    };
  } else if (currentZoom === 11) {
    return {
      marginLeft: 0,
      marginTop: 0,
    };
  } else if (currentZoom === 12) {
    return {
      transform: 'scale(1.5)',
    };
  } else if (currentZoom === 13) {
    return {
      transform: 'scale(2)',
    };
  } else if (currentZoom === 14) {
    return {
      transform: 'scale(2.5)',
    };
  } else if (currentZoom === 15) {
    return {
      transform: 'scale(2.5)',
    };
  } else if (currentZoom === 16) {
    return {
      transform: 'scale(2.5)',
    };
  } else if (currentZoom === 17) {
    return {
      transform: 'scale(2.5)',
    };
  } else if (currentZoom === 18) {
    return {
      transform: 'scale(2.5)',
    };
  }
};

export default null;
