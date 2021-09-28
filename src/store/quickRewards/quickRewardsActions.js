import { get, kebabCase, round } from 'lodash';

import { createAsyncActionType } from '../../client/helpers/stateHelpers';
import {
  getAuthorsChildWobjects,
  getCurrentHivePrice,
  searchObjects,
} from '../../waivioApi/ApiClient';
import { getAuthenticatedUserName } from '../authStore/authSelectors';
import { getLocale } from '../settingsStore/settingsSelectors';
import { createPost } from '../editorStore/editorActions';
import { createPostMetadata } from '../../client/helpers/postHelpers';
import { getBeneficiariesUsers } from '../searchStore/searchSelectors';
import { getSelectedDish, getSelectedRestaurant } from './quickRewardsSelectors';
import config from '../../waivioApi/config.json';
import { generatePermlink, getObjectName, getObjectType } from '../../client/helpers/wObjectHelper';
import { getDetailsBody } from '../../client/rewards/rewardsHelper';

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

export const TOGGLE_MODAL = '@quickRewards/TOGGLE_MODAL';

export const toggleModal = open => ({
  type: TOGGLE_MODAL,
  payload: open,
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

export const getEligibleRewardsListWithRestaurant = (selectRest, searchString) => (
  dispatch,
  getState,
) => {
  const state = getState();
  const name = getAuthenticatedUserName(state);
  const locale = getLocale(state);

  return dispatch({
    type: GET_ELIGIBLE_REWARDS_WITH_RESTAURANT.ACTION,
    payload: getAuthorsChildWobjects(selectRest.author_permlink, 0, 30, locale, '', name),
  });
};

export const CREATE_QUICK_POST = '@quickRewards/CREATE_QUICK_POST';

export const createQuickPost = (title, body, topics) => (dispatch, getState) => {
  const state = getState();
  const author = getAuthenticatedUserName(state);
  const beneficiaries = getBeneficiariesUsers(state);
  const restaurant = getSelectedRestaurant(state);
  const dish = getSelectedDish(state);
  const isReview = restaurant.campaigns && dish.propositions;
  const postData = {
    title,
    body,
    permlink: kebabCase(title),
    parentPermlink: config[process.env.NODE_ENV].appName,
    parentAuthor: '',
    author,
    jsonMetadata: createPostMetadata(body, topics, {
      wobj: {
        wobjects: [
          {
            object_type: getObjectType(restaurant),
            objectName: getObjectName(restaurant),
            author_permlink: restaurant.author_permlink,
            percent: 50,
          },
          {
            object_type: getObjectType(dish),
            objectName: getObjectName(dish),
            author_permlink: dish.author_permlink,
            percent: 50,
          },
        ],
      },
    }),
  };

  dispatch({ type: CREATE_QUICK_POST });

  dispatch(createPost(postData, beneficiaries, isReview, get(dish, '.propositions[0]', null)));
};

export const RESERVE_REWARD = createAsyncActionType('@quickRewards/RESERVE_REWARD');

export const reserveProposition = () => async (dispatch, getState, { steemConnectAPI }) => {
  const state = getState();
  const username = getAuthenticatedUserName(state);
  const dish = getSelectedDish(state);
  const proposition = dish.propositions[0];
  const proposedWobjName = getObjectName(dish);
  const proposedWobjAuthorPermlink = dish.author_permlink;
  const primaryObject = get(proposition, 'required_object');
  const currencyInfo = await getCurrentHivePrice();
  const amount = round(proposition.reward / currencyInfo.hiveCurrency, 3);
  const detailsBody = getDetailsBody({
    proposition,
    proposedWobjName,
    proposedWobjAuthorPermlink,
    primaryObjectName: proposition.required_object,
  });
  const commentOp = [
    'comment',
    {
      parent_author: proposition.guideName,
      parent_permlink: proposition.activation_permlink,
      author: username,
      permlink: `reserve-${generatePermlink()}`,
      title: 'Rewards reservations',
      body: `<p>User ${username} (@${username}) has reserved the rewards of ${amount} HIVE for a period of ${
        proposition.count_reservation_days
      } days to write a review of <a href="/object/${
        dish.author_permlink
      }">${proposedWobjName}</a>, <a href="/object/${
        primaryObject.author_permlink
      }">${getObjectName(primaryObject)}</a></p>${detailsBody}`,
      json_metadata: JSON.stringify({
        app: config.appName,
        waivioRewards: {
          type: 'waivio_assign_campaign',
          approved_object: proposedWobjAuthorPermlink,
          currencyId: currencyInfo.id,
        },
      }),
    },
  ];

  return new Promise((resolve, reject) => {
    steemConnectAPI
      .broadcast([commentOp])
      .then(() => resolve('SUCCESS'))
      .then(() =>
        dispatch({
          type: RESERVE_REWARD.START,
        }),
      )
      .catch(error => reject(error));
  });
};

export default null;
