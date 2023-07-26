import { getAffiliateObjectForWebsite } from '../../waivioApi/ApiClient';
import { createAsyncActionType } from '../../common/helpers/stateHelpers';

export const SET_AFFILIATE_OBJECTS = createAsyncActionType('@affiliateCodes/SET_AFFILIATE_OBJECTS');
export const setAffiliateObjects = (userName, host) => dispatch => {
  dispatch({
    type: SET_AFFILIATE_OBJECTS.ACTION,
    payload: { promise: getAffiliateObjectForWebsite(userName, host) },
  });
};
export const setLoadingAffiliateObjects = authorPermlink => dispatch => {
  dispatch({
    type: SET_AFFILIATE_OBJECTS.START,
    payload: { authorPermlink },
  });
};
export const RESET_AFFILIATE_OBJECTS = '@affiliateCodes/RESET_AFFILIATE_OBJECTS';
export const resetAffiliateObjects = () => dispatch => {
  dispatch({
    type: RESET_AFFILIATE_OBJECTS,
  });
};
