import { createAsyncActionType } from '../../common/helpers/stateHelpers';
import { getActiveCampaignsFromApi } from '../../waivioApi/ApiClient';
import { getAuthenticatedUserName } from '../authStore/authSelectors';

export const GET_ACTIVE_CAMPAIGN = createAsyncActionType('GET_ACTIVE_CAMPAIGN');

export const getActiveCampaign = ({ objectType, skip = 0, limit = 15 }) => (dispatch, getState) => {
  const state = getState();
  const follower = getAuthenticatedUserName(state);

  return dispatch({
    type: GET_ACTIVE_CAMPAIGN.ACTION,
    payload: getActiveCampaignsFromApi({ objectType, skip, limit }, follower),
    meta: { isMore: Boolean(skip) },
  });
};
