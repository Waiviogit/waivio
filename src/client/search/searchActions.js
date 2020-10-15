import _ from 'lodash';
import { message } from 'antd';
import { createAsyncActionType } from '../helpers/stateHelpers';
import { getAccountReputation, getAllSearchResultPages } from '../helpers/apiHelpers';
import * as ApiClient from '../../waivioApi/ApiClient';
import { getAuthenticatedUserName, getLocale, getSuitableLanguage } from '../reducers';
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

export const searchAskSteem = search => dispatch =>
  dispatch({
    type: SEARCH_ASK_STEEM.ACTION,
    payload: {
      promise: Promise.all([
        getAllSearchResultPages(search)
          .then(response => {
            let mergedResults = [];
            _.each(response, element => {
              mergedResults = _.concat(mergedResults, element.results);
            });
            return _.reverse(_.sortBy(mergedResults, ['type', 'created']));
          })
          .catch(() => []),
        getAccountReputation(search),
      ]),
    },
  });

export const searchAutoComplete = (
  search,
  userLimit,
  wobjectsLimit,
  objectTypesLimit,
) => dispatch =>
  dispatch({
    type: AUTO_COMPLETE_SEARCH.ACTION,
    payload: {
      promise: ApiClient.getSearchResult(search, userLimit, wobjectsLimit, objectTypesLimit).then(
        result => ({
          result,
          search,
        }),
      ),
    },
  });

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
  const locale = getLocale(state);
  const search = replacer(searchString, '@');
  dispatch({
    type: SEARCH_OBJECTS.ACTION,
    payload: ApiClient.searchObjects(search, objType, forParent, 15, locale).then(result => ({
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
export const searchObjectTypesAutoCompete = (searchString, objType) => dispatch =>
  dispatch({
    type: SEARCH_OBJECT_TYPES.ACTION,
    payload: {
      promise: ApiClient.searchObjectTypes(searchString, objType).then(result => ({
        result,
        search: searchString,
      })),
    },
  });

export const clearSearchObjectsResults = () => dispatch =>
  dispatch({
    type: CLEAR_SEARCH_OBJECTS_RESULT,
  });

export const resetSearchUsersForDiscoverPage = () => dispatch =>
  dispatch({
    type: RESET_SEARCH_USERS_FOR_DISCOVER_PAGE,
  });

export const searchUsersForDiscoverPage = (userName, limit) => dispatch => {
  const search = replacer(userName, '@');

  dispatch({
    type: SEARCH_USERS_FOR_DISCOVER_PAGE.ACTION,
    payload: {
      promise: ApiClient.searchUsers(search, limit)
        .then(result => ({
          result,
          search,
        }))
        .catch(e => message.error(e)),
    },
  });
};
