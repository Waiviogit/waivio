import { get, isArray, isEmpty, isNil, size } from 'lodash';
import { message } from 'antd';

import { getLastBlockNum } from '../vendor/steemitHelpers';
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
  username,
  host,
  currentActionType,
  processingFunction,
  meta,
) => async (dispatch, getState, { busyAPI }) => {
  const blockNumber = await getLastBlockNum();

  busyAPI.instance.sendAsync(subscribeMethod, [username, blockNumber, subscribeTypes.posts]);
  busyAPI.instance.subscribe((response, mess) => {
    if (subscribeTypes.posts === mess.type && mess.notification.blockParsed === blockNumber) {
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

const degreesToRadians = degrees => (degrees * Math.PI) / 180;
const radius = 6371000;

export const distanceInMBetweenEarthCoordinates = ([lat1, lon1], [lat2, lon2]) => {
  const dLat = degreesToRadians(lat2 - lat1);
  const dLon = degreesToRadians(lon2 - lon1);

  const lat1Rad = degreesToRadians(lat1);
  const lat2Rad = degreesToRadians(lat2);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1Rad) * Math.cos(lat2Rad);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(radius * c);
};

export const getFirstOffsetNumber = wobjName => {
  const lengthMoreThanOrSame = number => size(wobjName) <= number;

  if (lengthMoreThanOrSame(15)) return 125;
  if (lengthMoreThanOrSame(20)) return 160;
  if (lengthMoreThanOrSame(35)) return 180;

  return 170;
};

export const showGoogleGSCTagError = tag => {
  const metaRegex = /<meta[^>]*>/g;
  const metaTags = tag?.match(metaRegex);

  return (
    !isEmpty(tag) &&
    (!tag?.includes('<meta name="google-site-verification"') ||
      !tag?.includes('content="') ||
      metaTags.length > 1)
  );
};
export const showGoogleAdsConfigError = str =>
  !isEmpty(str) && (!str?.includes('gtag') || !str?.includes('config'));
export const showGoogleEventSnippetError = tag => {
  const openingScriptRegex = /<script[^>]*>/g;
  const closingScriptRegex = /<\/script>/g;
  const openingTangs = tag?.match(openingScriptRegex);
  const closingTangs = tag?.match(closingScriptRegex);

  return (
    !isEmpty(tag) &&
    (!tag?.includes('gtag_report_conversion') ||
      isNil(openingTangs) ||
      isNil(closingTangs) ||
      openingTangs?.length > 1 ||
      closingTangs?.length > 1)
  );
};

export default null;
