import { createAsyncActionType } from '../../client/helpers/stateHelpers';
import {getEligibleList, searchObjects} from '../../waivioApi/ApiClient';
import { getAuthenticatedUserName } from '../authStore/authSelectors';
import {getLocale} from "../settingsStore/settingsSelectors";

export const GET_ELIGIBLE_REWARDS = createAsyncActionType('@quickRewards/GET_ELIGIBLE_REWARDS');

export const getEligibleRewardsList = searchString => (dispatch, getState) => {
  const state = getState();
  const locale = getLocale(state);

  return dispatch({
    type: GET_ELIGIBLE_REWARDS.ACTION,
    payload: searchObjects(searchString, 'restaurant', false, 20, locale),
  });
};

export const SELECT_DISH = '@quickRewards/SELECT_DISH';

export const setSelectedDish = rest => ({
  type: SELECT_DISH,
  payload: rest,
});

export const RESET_RESTAURANT = '@quickRewards/RESET_RESTAURANT';

export const resetRestaurant = () => ({
  type: RESET_RESTAURANT,
});

export const RESET_DISH = '@quickRewards/RESET_DISH';

export const resetDish = () => ({
  type: RESET_DISH,
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
