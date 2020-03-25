import { each, concat, reverse, sortBy } from 'lodash';
import { createAsyncActionType } from '../helpers/stateHelpers';
import { getAccountReputation, getAllSearchResultPages } from '../helpers/apiHelpers';
import * as ApiClient from '../../waivioApi/ApiClient';
import { getSuitableLanguage, getFollowingList, getAuthenticatedUserName } from '../reducers';
import { replacer } from '../helpers/parser';

export const SEARCH_ASK_STEEM = createAsyncActionType('@search/SEARCH_ASK_STEEM');
export const AUTO_COMPLETE_SEARCH = createAsyncActionType('@search/AUTO_COMPLETE_SEARCH');
export const RESET_AUTO_COMPLETE_SEARCH = '@search/RESET_AUTO_COMPLETE_SEARCH';
export const SEARCH_OBJECTS = createAsyncActionType('@search/SEARCH_OBJECTS');
export const CLEAR_SEARCH_OBJECTS_RESULT = '@search/CLEAR_SEARCH_OBJECTS_RESULT';
export const SEARCH_USERS = createAsyncActionType('@search/SEARCH_USERS');
export const SEARCH_OBJECT_TYPES = createAsyncActionType('@search/SEARCH_OBJECT_TYPES');

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

  dispatch({
    type: AUTO_COMPLETE_SEARCH.ACTION,
    payload: {
      promise: ApiClient.getSearchResult(
        searchString,
        userLimit,
        wobjectsLimi,
        objectTypesLimit,
        user,
      ).then(result => ({
        result,
        search: searchString,
      })),
    },
    meta: {
      followingUsersList: getFollowingList(state),
    },
  });
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

export const searchUsersAutoCompete = (userName, limit) => (dispatch, getState) => {
  const search = replacer(userName, '@');
  const user = getAuthenticatedUserName(getState());

  dispatch({
    type: SEARCH_USERS.ACTION,
    payload: {
      promise: ApiClient.searchUsers(search, user, limit)
        .then(result => ({
          result,
          search,
        }))
        .catch(console.log),
    },
  });
};

export const searchObjectTypesAutoCompete = (searchString, objType) => dispatch => {
  const search = replacer(searchString, '@');

  dispatch({
    type: SEARCH_OBJECT_TYPES.ACTION,
    payload: {
      promise: ApiClient.searchObjectTypes(search, objType).then(result => ({
        result,
        search,
      })),
    },
  });
};

export const clearSearchObjectsResults = () => dispatch =>
  dispatch({
    type: CLEAR_SEARCH_OBJECTS_RESULT,
  });
