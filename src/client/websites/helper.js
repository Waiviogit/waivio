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

export const getCurrStyleAfterZoom = (currentZoom, setCurrStyle, currStyle) => {
  if (currentZoom < 4 && currentZoom > 0) {
    setCurrStyle({
      ...currStyle,
      transform: 'scale(0.2)',
      marginLeft: -205,
      marginTop: -128,
    });
  } else if (currentZoom === 4) {
    setCurrStyle({
      ...currStyle,
      transform: 'scale(0.2)',
      marginLeft: -225,
      marginTop: -135,
    });
  } else if (currentZoom === 5) {
    setCurrStyle({
      ...currStyle,
      transform: 'scale(0.3)',
      marginLeft: -266,
      marginTop: -153,
    });
  } else if (currentZoom === 6) {
    setCurrStyle({
      ...currStyle,
      transform: 'scale(0.4)',
      marginLeft: -202,
      marginTop: -118,
    });
  } else if (currentZoom === 7) {
    setCurrStyle({
      ...currStyle,
      transform: 'scale(0.5)',
      marginLeft: -210,
      marginTop: -115,
    });
  } else if (currentZoom === 8) {
    setCurrStyle({
      ...currStyle,
      transform: 'scale(0.6)',
      marginLeft: -183,
      marginTop: -120,
    });
  } else if (currentZoom === 9) {
    setCurrStyle({
      ...currStyle,
      transform: 'scale(0.7)',
      marginLeft: -190,
      marginTop: -120,
    });
  } else if (currentZoom === 10) {
    setCurrStyle({
      ...currStyle,
      transform: 'scale(0.8)',
      marginLeft: -190,
      marginTop: -125,
    });
  } else if (currentZoom === 11) {
    setCurrStyle({
      ...currStyle,
      marginLeft: -183,
      marginTop: -123,
      zoom: 1.1,
    });
  } else if (currentZoom === 12) {
    setCurrStyle({
      ...currStyle,
      marginLeft: -195,
      marginTop: -130,
      zoom: 1.2,
    });
  } else if (currentZoom === 13) {
    setCurrStyle({
      ...currStyle,
      marginLeft: -120,
      marginTop: -83,
      zoom: 1.3,
    });
  } else if (currentZoom === 14) {
    setCurrStyle({
      ...currStyle,
      marginLeft: -121,
      marginTop: -81,
      zoom: 1.4,
    });
  } else if (currentZoom === 15) {
    setCurrStyle({
      ...currStyle,
      marginLeft: -132,
      marginTop: -85,
      zoom: 1.5,
    });
  } else if (currentZoom === 16) {
    setCurrStyle({
      ...currStyle,
      marginLeft: -140,
      marginTop: -85,
      zoom: 1.6,
    });
  } else if (currentZoom === 17) {
    setCurrStyle({
      ...currStyle,
      marginLeft: -150,
      marginTop: -80,
      zoom: 1.7,
    });
  } else if (currentZoom === 18) {
    setCurrStyle({
      ...currStyle,
      marginLeft: -130,
      marginTop: -80,
      zoom: 1.8,
    });
  }
};

export default null;
