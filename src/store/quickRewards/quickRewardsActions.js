import { createAsyncActionType } from '../../client/helpers/stateHelpers';
import { getEligibleList } from '../../waivioApi/ApiClient';
import { getAuthenticatedUserName } from '../authStore/authSelectors';
import { getSelectedRestaurant } from './quickRewardsSelectors';

export const GET_ELIGIBLE_REWARDS = createAsyncActionType('@quickRewards/GET_ELIGIBLE_REWARDS');

export const getEligibleRewardsList = () => (dispatch, getState) => {
  const state = getState();
  const name = getAuthenticatedUserName(state);

  return dispatch({
    type: GET_ELIGIBLE_REWARDS.ACTION,
    payload: getEligibleList(name),
  });
};

export const SELECT_DISH = '@quickRewards/SELECT_DISH';

export const setSelectedDish = rest => ({
  type: SELECT_DISH,
  payload: rest,
});

export const SELECT_RESTAURANT = '@quickRewards/SELECT_RESTAURANT';

export const setSelectedRestaurant = rest => ({
  type: SELECT_RESTAURANT,
  payload: rest,
});

export const GET_ELIGIBLE_REWARDS_WITH_RESTAURANT = createAsyncActionType(
  '@quickRewards/GET_ELIGIBLE_REWARDS_WITH_RESTAURANT',
);

export const getEligibleRewardsListWithRestaurant = selectRest => (dispatch, getState) => {
  const state = getState();
  const name = getAuthenticatedUserName(state);

  return dispatch({
    type: GET_ELIGIBLE_REWARDS_WITH_RESTAURANT.ACTION,
    payload: getEligibleList(name, selectRest.author_permlink),
  });
};

export default null;
