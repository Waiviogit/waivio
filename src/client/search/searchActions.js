import { each, concat, reverse, sortBy } from 'lodash';
import { message } from 'antd';
import { createAsyncActionType } from '../helpers/stateHelpers';
import { getAccountReputation, getAllSearchResultPages } from '../helpers/apiHelpers';
import * as ApiClient from '../../waivioApi/ApiClient';
import {
  getSuitableLanguage,
  getFollowingList,
  getAuthenticatedUserName,
  getIsAuthenticated,
  getLocale,
} from '../reducers';
import { replacer } from '../helpers/parser';

export const SEARCH_ASK_STEEM = createAsyncActionType('@search/SEARCH_ASK_STEEM');
export const AUTO_COMPLETE_SEARCH = createAsyncActionType('@search/AUTO_COMPLETE_SEARCH');
export const RESET_AUTO_COMPLETE_SEARCH = '@search/RESET_AUTO_COMPLETE_SEARCH';
export const SEARCH_OBJECTS = createAsyncActionType('@search/SEARCH_OBJECTS');
export const CLEAR_SEARCH_OBJECTS_RESULT = '@search/CLEAR_SEARCH_OBJECTS_RESULT';
export const SEARCH_USERS = createAsyncActionType('@search/SEARCH_USERS');
export const SEARCH_OBJECT_TYPES = createAsyncActionType('@search/SEARCH_OBJECT_TYPES');
export const SEARCH_USERS_FOR_DISCOVER_PAGE = createAsyncActionType(
  '@search/SEARCH_USERS_FOR_DISCOVER_PAGE',
);
export const RESET_SEARCH_USERS_FOR_DISCOVER_PAGE = '@search/RESET_SEARCH_USERS_FOR_DISCOVER_PAGE';
export const SAVE_BENEFICIARIES_USERS = createAsyncActionType('@search/SAVE_BENEFICIARIES_USERS');
export const UPDATE_BENEFICIARIES_USERS = createAsyncActionType(
  '@search/UPDATE_BENEFICIARIES_USERS',
);
export const REMOVE_BENEFICIARIES_USERS = createAsyncActionType(
  '@search/REMOVE_BENEFICIARIES_USERS',
);
export const CLEAR_BENEFICIARIES_USERS = createAsyncActionType('@search/CLEAR_BENEFICIARIES_USERS');

export const searchAskSteem = search => dispatch =>
  dispatch({
    type: SEARCH_ASK_STEEM.ACTION,
    payload: {
      promise: Promise.all([
        getAllSearchResultPages(search)
          .then(response => {
            let mergedResults = [];
            each(response, element => {
              mergedResults = concat(mergedResults, element.results);
            });
            return reverse(sortBy(mergedResults, ['type', 'created']));
          })
          .catch(() => []),
        getAccountReputation(search),
      ]),
    },
  });

export const searchAutoComplete = (search, userLimit, wobjectsLimi, objectTypesLimit) => (
  dispatch,
  getState,
) => {
  const state = getState();
  const searchString = replacer(search, '@');
  const user = getAuthenticatedUserName(state);
  const locale = getLocale(state);

  if (searchString) {
    dispatch({
      type: AUTO_COMPLETE_SEARCH.ACTION,
      payload: {
        promise: ApiClient.getSearchResult(
          searchString,
          userLimit,
          wobjectsLimi,
          objectTypesLimit,
          user,
          locale,
        ).then(result => ({
          result,
          search: searchString,
        })),
      },
      meta: {
        followingUsersList: getFollowingList(state),
      },
    });
  }
};

export const resetSearchAutoCompete = () => dispatch =>
  dispatch({
    type: RESET_AUTO_COMPLETE_SEARCH,
  });

export const searchObjectsAutoCompete = (searchString, objType, forParent) => (
  dispatch,
  getState,
) => {
  const state = getState();
  const usedLocale = getSuitableLanguage(state);
  const search = replacer(searchString, '@');

  dispatch({
    type: SEARCH_OBJECTS.ACTION,
    payload: ApiClient.searchObjects(search, objType, forParent).then(result => ({
      result,
      search,
      locale: usedLocale,
    })),
  }).catch(error => console.log('Object search >', error.message));
};

export const searchUsersAutoCompete = (userName, limit, notGuest = false) => (
  dispatch,
  getState,
) => {
  const search = replacer(userName, '@');
  const user = getAuthenticatedUserName(getState());

  if (search) {
    dispatch({
      type: SEARCH_USERS.ACTION,
      payload: {
        promise: ApiClient.searchUsers(search, user, limit, notGuest)
          .then(result => ({
            result,
            search,
          }))
          .catch(console.log),
      },
    });
  }
};
export const searchUsersForDiscoverPage = (userName, limit) => (dispatch, getState) => {
  const search = replacer(userName, '@');
  const user = getAuthenticatedUserName(getState());

  if (search) {
    dispatch({
      type: SEARCH_USERS_FOR_DISCOVER_PAGE.ACTION,
      payload: {
        promise: ApiClient.searchUsers(search, user, limit)
          .then(result => ({
            result,
            search,
          }))
          .catch(e => message.error(e)),
      },
    });
  }
};

export const UNFOLLOW_SEARCH_USER = createAsyncActionType('@users/UNFOLLOW_SEARCH_USER');

export const unfollowSearchUser = username => (dispatch, getState, { steemConnectAPI }) => {
  const state = getState();

  if (!getIsAuthenticated(state)) {
    return Promise.reject('User is not authenticated');
  }

  return dispatch({
    type: UNFOLLOW_SEARCH_USER.ACTION,
    payload: {
      promise: steemConnectAPI.unfollow(getAuthenticatedUserName(state), username),
    },
    meta: {
      username,
    },
  });
};
export const FOLLOW_SEARCH_USER = createAsyncActionType('@user/FOLLOW_SEARCH_USER');

export const followSearchUser = username => (dispatch, getState, { steemConnectAPI }) => {
  const state = getState();

  if (!getIsAuthenticated(state)) {
    return Promise.reject('User is not authenticated');
  }

  return dispatch({
    type: FOLLOW_SEARCH_USER.ACTION,
    payload: {
      promise: steemConnectAPI.follow(getAuthenticatedUserName(state), username),
    },
    meta: {
      username,
    },
  });
};

export const resetSearchUsersForDiscoverPage = () => dispatch =>
  dispatch({
    type: RESET_SEARCH_USERS_FOR_DISCOVER_PAGE,
  });

export const searchObjectTypesAutoCompete = (searchString, objType) => dispatch => {
  const search = replacer(searchString, '@');

  if (searchString) {
    dispatch({
      type: SEARCH_OBJECT_TYPES.ACTION,
      payload: {
        promise: ApiClient.searchObjectTypes(search, objType).then(result => ({
          result,
          search,
        })),
      },
    });
  }
};

export const clearSearchObjectsResults = () => dispatch =>
  dispatch({
    type: CLEAR_SEARCH_OBJECTS_RESULT,
  });

export const saveBeneficiariesUsers = payload => dispatch =>
  dispatch({
    type: SAVE_BENEFICIARIES_USERS.ACTION,
    payload,
  });

export const updateBeneficiariesUsers = payload => dispatch =>
  dispatch({
    type: UPDATE_BENEFICIARIES_USERS.ACTION,
    payload,
  });

export const removeBeneficiariesUsers = payload => dispatch =>
  dispatch({
    type: REMOVE_BENEFICIARIES_USERS.ACTION,
    payload,
  });

export const clearBeneficiariesUsers = () => dispatch =>
  dispatch({
    type: CLEAR_BENEFICIARIES_USERS.ACTION,
  });
