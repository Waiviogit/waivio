import { get, kebabCase } from 'lodash';

import { createAsyncActionType } from '../../common/helpers/stateHelpers';
import { getAuthorsChildWobjects, searchObjects } from '../../waivioApi/ApiClient';
import { getAuthenticatedUserName } from '../authStore/authSelectors';
import { getLocale } from '../settingsStore/settingsSelectors';
import { createPostMetadata } from '../../common/helpers/postHelpers';
import { getBeneficiariesUsers } from '../searchStore/searchSelectors';
import { createPost } from '../slateEditorStore/editorActions';
import { getSelectedDish, getSelectedRestaurant } from './quickRewardsSelectors';
import config from '../../waivioApi/config.json';
import { getObjectName, getObjectType } from '../../common/helpers/wObjectHelper';
import { getCurrentHost } from '../appStore/appSelectors';

export const GET_ELIGIBLE_REWARDS = createAsyncActionType('@quickRewards/GET_ELIGIBLE_REWARDS');

export const getEligibleRewardsList = searchString => (dispatch, getState) => {
  const state = getState();
  const locale = getLocale(state);
  const authUser = getAuthenticatedUserName(state);

  return dispatch({
    type: GET_ELIGIBLE_REWARDS.ACTION,
    payload: searchObjects(searchString, 'restaurant', false, 20, locale, { userName: authUser }),
  });
};

export const SELECT_DISH = '@quickRewards/SELECT_DISH';

export const setSelectedDish = rest => ({
  type: SELECT_DISH,
  payload: rest,
});

export const TOGGLE_MODAL = '@quickRewards/TOGGLE_MODAL';

export const toggleModal = (open, isNew) => ({
  type: TOGGLE_MODAL,
  payload: { open, isNew },
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

export const getEligibleRewardsListWithRestaurant = (selectRest, limit) => async (
  dispatch,
  getState,
) => {
  const state = getState();
  const name = getAuthenticatedUserName(state);
  const locale = getLocale(state);

  dispatch({ type: GET_ELIGIBLE_REWARDS_WITH_RESTAURANT.START });

  try {
    const objChild = await getAuthorsChildWobjects(
      selectRest.author_permlink,
      0,
      limit,
      locale,
      'list',
      name,
    );

    return dispatch({
      type: GET_ELIGIBLE_REWARDS_WITH_RESTAURANT.SUCCESS,
      payload: objChild,
    });
  } catch (e) {
    return dispatch({ type: GET_ELIGIBLE_REWARDS_WITH_RESTAURANT.ERROR });
  }
};

export const GET_MORE_ELIGIBLE_REWARDS_WITH_RESTAURANT = createAsyncActionType(
  '@quickRewards/GET_MORE_ELIGIBLE_REWARDS_WITH_RESTAURANT',
);

export const getMoreEligibleRewardsListWithRestaurant = (selectRest, skip) => async (
  dispatch,
  getState,
) => {
  const state = getState();
  const name = getAuthenticatedUserName(state);
  const locale = getLocale(state);

  dispatch({ type: GET_MORE_ELIGIBLE_REWARDS_WITH_RESTAURANT.START });

  try {
    const objChild = await getAuthorsChildWobjects(
      selectRest.author_permlink,
      skip,
      100,
      locale,
      'list',
      name,
    );

    return dispatch({
      type: GET_MORE_ELIGIBLE_REWARDS_WITH_RESTAURANT.SUCCESS,
      payload: objChild,
    });
  } catch (e) {
    return dispatch({ type: GET_MORE_ELIGIBLE_REWARDS_WITH_RESTAURANT.ERROR });
  }
};

export const CREATE_QUICK_POST = '@quickRewards/CREATE_QUICK_POST';

export const createQuickPost = (userBody, topics, images, reservationPermlink) => async (
  dispatch,
  getState,
) => {
  const state = getState();
  const author = getAuthenticatedUserName(state);
  const beneficiaries = getBeneficiariesUsers(state);
  const restaurant = getSelectedRestaurant(state);
  const dish = getSelectedDish(state);
  const host = getCurrentHost(state);

  const isReview = Boolean(dish.propositions || dish.reward);
  const campaignId = isReview ? get(dish, 'propositions[0]._id') : null;
  const imagesLink = images?.map(img => `\n<center>![image]( ${img.src})</center>`).join('');
  const withDish = dish.author_permlink !== restaurant.author_permlink;
  const topicsLink = topics
    ?.map(tag => `\n[#${tag}](https://www.waivio.com/object/${tag})`)
    .join('');
  const title = withDish
    ? `Review: ${getObjectName(restaurant)}, ${getObjectName(dish)}`
    : `Review: ${getObjectName(restaurant)}`;
  let body = `\n[${getObjectName(restaurant)}](${host}/object/${restaurant.author_permlink})`;

  if (withDish) {
    body += `\n[${getObjectName(dish)}](${host}/object/${dish.author_permlink})\n`;
  }

  body += `${imagesLink} ${userBody} ${topicsLink}`;

  if (isReview) {
    const guideName = dish?.guideName || dish?.propositions?.[0]?.guideName;

    body += `\n***\n<center>This review was sponsored in part by ${guideName} ([@${guideName}](/@${guideName}))</center>`;
  }

  const postData = {
    title,
    body,
    permlink: kebabCase(title),
    parentPermlink: config[process.env.NODE_ENV].appName,
    parentAuthor: '',
    author,
    jsonMetadata: createPostMetadata(
      body,
      topics,
      {
        reservation_permlink: reservationPermlink,
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
      },
      null,
      campaignId,
      host,
      reservationPermlink,
    ),
  };

  await dispatch(
    createPost(postData, beneficiaries, isReview, get(dish, '.propositions[0]', null)),
  );
  await dispatch({ type: CREATE_QUICK_POST });
};

export default null;
