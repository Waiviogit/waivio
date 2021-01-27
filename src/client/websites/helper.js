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

export const getCurrStyleAfterZoom = (currentZoom, setCurrStyle, currStyle) => {
  switch (currentZoom) {
    case 4: {
      return setCurrStyle({
        ...currStyle,
        transform: 'scale(0.2)',
        marginLeft: -225,
        marginTop: -135,
      });
    }
    case 5: {
      return setCurrStyle({
        ...currStyle,
        transform: 'scale(0.3)',
        marginLeft: -266,
        marginTop: -153,
      });
    }
    case 6: {
      return setCurrStyle({
        ...currStyle,
        transform: 'scale(0.4)',
        marginLeft: -202,
        marginTop: -118,
      });
    }
    case 7: {
      return setCurrStyle({
        ...currStyle,
        transform: 'scale(0.5)',
        marginLeft: -210,
        marginTop: -115,
      });
    }
    case 8: {
      return setCurrStyle({
        ...currStyle,
        transform: 'scale(0.6)',
        marginLeft: -183,
        marginTop: -120,
      });
    }
    case 9: {
      return setCurrStyle({
        ...currStyle,
        transform: 'scale(0.7)',
        marginLeft: -190,
        marginTop: -120,
      });
    }
    case 10: {
      return setCurrStyle({
        ...currStyle,
        transform: 'scale(0.8)',
        marginLeft: -190,
        marginTop: -125,
      });
    }
    case 11: {
      return setCurrStyle({
        ...currStyle,
        marginLeft: -183,
        marginTop: -123,
        zoom: 1.1,
      });
    }
    case 12: {
      return setCurrStyle({
        ...currStyle,
        marginLeft: -195,
        marginTop: -130,
        zoom: 1.2,
      });
    }
    case 13: {
      return setCurrStyle({
        ...currStyle,
        marginLeft: -120,
        marginTop: -83,
        zoom: 1.3,
      });
    }
    case 14: {
      return setCurrStyle({
        ...currStyle,
        marginLeft: -121,
        marginTop: -81,
        zoom: 1.4,
      });
    }
    case 15: {
      return setCurrStyle({
        ...currStyle,
        marginLeft: -132,
        marginTop: -85,
        zoom: 1.5,
      });
    }
    case 16: {
      return setCurrStyle({
        ...currStyle,
        marginLeft: -140,
        marginTop: -85,
        zoom: 1.6,
      });
    }
    case 17: {
      return setCurrStyle({
        ...currStyle,
        marginLeft: -150,
        marginTop: -80,
        zoom: 1.7,
      });
    }
    case 18: {
      return setCurrStyle({
        ...currStyle,
        marginLeft: -130,
        marginTop: -80,
        zoom: 1.8,
      });
    }
    default: {
      return setCurrStyle({
        ...currStyle,
        transform: 'scale(0.2)',
        marginLeft: -205,
        marginTop: -128,
      });
    }
  }
};

export default null;
