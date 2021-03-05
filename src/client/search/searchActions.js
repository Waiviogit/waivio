import { isEmpty, uniqWith, isEqual } from 'lodash';
import { message } from 'antd';
import { createAsyncActionType } from '../helpers/stateHelpers';
import * as ApiClient from '../../waivioApi/ApiClient';
import {
  getSuitableLanguage,
  getFollowingList,
  getAuthenticatedUserName,
  getIsAuthenticated,
  getLocale,
  getWebsiteSearchType,
  getSearchFiltersTagCategory,
  getSearchSort,
  getIsWaivio,
  getWebsiteMap,
  getSearchInBox,
} from '../reducers';
import { replacer } from '../helpers/parser';

export const AUTO_COMPLETE_SEARCH = createAsyncActionType('@search/AUTO_COMPLETE_SEARCH');
export const RESET_AUTO_COMPLETE_SEARCH = '@search/RESET_AUTO_COMPLETE_SEARCH';
export const SEARCH_OBJECTS = createAsyncActionType('@search/SEARCH_OBJECTS');
export const SEARCH_OBJECTS_LOADING_MORE_FOR_WEBSITE = createAsyncActionType(
  '@search/SEARCH_OBJECTS_LOADING_MORE_FOR_WEBSITE',
);
export const CLEAR_SEARCH_OBJECTS_RESULT = '@search/CLEAR_SEARCH_OBJECTS_RESULT';
export const RESET_TO_INITIAL_IS_CLEAR_SEARCH_OBJECTS =
  '@search/RESET_TO_INITIAL_IS_CLEAR_SEARCH_OBJECTS';
export const SEARCH_USERS = createAsyncActionType('@search/SEARCH_USERS');
export const SEARCH_USERS_LOADING_MORE = createAsyncActionType('@search/SEARCH_USERS_LOADING_MORE');
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

export const GET_FILTER_FOR_SEARCH = createAsyncActionType('@search/GET_FILTER_FOR_SEARCH');
export const GET_FILTER_FOR_SEARCH_MORE = createAsyncActionType(
  '@search/GET_FILTER_FOR_SEARCH_MORE',
);

export const getFilterForSearch = (type, links, more = false) => ({
  type: more ? GET_FILTER_FOR_SEARCH_MORE.ACTION : GET_FILTER_FOR_SEARCH.ACTION,
  payload: ApiClient.getObjectTypeFilters(type, links),
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
    payload: ApiClient.searchObjects(search, objType, forParent, 15, locale)
      .then(result => ({
        result,
        search,
        locale: usedLocale,
      }))
      .then(() => {}),
  }).catch(error => console.log('Object search >', error.message));
};

export const SET_SEARCH_IN_BOX = '@search/SET_SEARCH_IN_BOX';

export const setSearchInBox = payload => ({ type: SET_SEARCH_IN_BOX, payload });

export const SEARCH_OBJECTS_FOR_WEBSITE = createAsyncActionType(
  '@search/SEARCH_OBJECTS_FOR_WEBSITE',
);

export const searchObjectsAutoCompeteLoadingMore = (
  searchString,
  objType,
  skip,
  forParent = false,
) => (dispatch, getState) => {
  const state = getState();
  const locale = getLocale(state);
  const userName = getAuthenticatedUserName(state);
  const tagsFilter = getSearchFiltersTagCategory(state);
  const tagCategory = isEmpty(tagsFilter) ? {} : { tagCategory: tagsFilter };
  const sort = getSearchSort(state);
  const { coordinates, topPoint, bottomPoint } = getWebsiteMap(state);
  const inBox = getSearchInBox(state);
  const body = {
    userName,
    sort,
    ...tagCategory,
  };

  if (searchString && !inBox) body.map = { coordinates, radius: 12742000 };
  else body.box = { topPoint, bottomPoint };

  return dispatch({
    type: SEARCH_OBJECTS_LOADING_MORE_FOR_WEBSITE.ACTION,
    payload: ApiClient.searchObjects(searchString, objType, forParent, 15, locale, body, skip).then(
      async res => {
        const links = res.wobjects.map(wobj => wobj.author_permlink);
        dispatch(getFilterForSearch(objType, links, true));

        if (!res.hasMore && inBox) {
          dispatch(setSearchInBox(false));

          return { ...res, hasMore: true };
        }

        return res;
      },
    ),
  }).catch(() => dispatch(setSearchInBox(false)));
};

export const searchWebsiteObjectsAutoCompete = (searchString, sort = 'weight', limit = 15) => (
  dispatch,
  getState,
) => {
  const state = getState();
  const locale = getLocale(state);
  const objType = getWebsiteSearchType(state);
  const userName = getAuthenticatedUserName(state);
  const tagsFilter = getSearchFiltersTagCategory(state);
  const tagCategory = isEmpty(tagsFilter) ? {} : { tagCategory: tagsFilter };
  const { topPoint, bottomPoint, coordinates } = getWebsiteMap(state);
  const body = {
    userName,
    sort,
    box: { topPoint, bottomPoint },
    ...tagCategory,
  };

  return dispatch({
    type: SEARCH_OBJECTS_FOR_WEBSITE.ACTION,
    payload: ApiClient.searchObjects(searchString, objType, false, limit, locale, body)
      .then(async res => {
        const links = res.wobjects.map(wobj => wobj.author_permlink);
        dispatch(getFilterForSearch(objType, links));

        if (!res.hasMore && searchString) {
          dispatch(setSearchInBox(false));
          const bodyWithMap = {
            map: { coordinates, radius: 12742000 },
            userName,
            sort,
            ...tagCategory,
          };

          try {
            const k = await ApiClient.searchObjects(
              searchString,
              objType,
              false,
              limit,
              locale,
              bodyWithMap,
            );

            return { wobjects: [...res.wobjects, ...k.wobjects], hasMore: true };
          } catch (e) {
            return res;
          }
        }

        return res;
      })
      .catch(async () => {
        dispatch(setSearchInBox(false));
        const bodyWithMap = {
          map: { coordinates, radius: 12742000 },
          userName,
          sort,
          ...tagCategory,
        };

        try {
          return await ApiClient.searchObjects(
            searchString,
            objType,
            false,
            limit,
            locale,
            bodyWithMap,
          );
        } catch (e) {
          return [];
        }
      }),
  });
};

export const searchUsersAutoCompete = (userName, limit, notGuest = false) => (
  dispatch,
  getState,
) => {
  const search = replacer(userName, '@');
  const user = getAuthenticatedUserName(getState());

  dispatch({
    type: SEARCH_USERS.ACTION,
    payload: {
      promise: ApiClient.searchUsers(search, user, limit, notGuest)
        .then(result => ({
          result,
        }))
        .catch(console.log),
    },
  });
};

export const searchUsersAutoCompeteLoadingMore = (userName, skip) => (dispatch, getState) => {
  const user = getAuthenticatedUserName(getState());

  dispatch({
    type: SEARCH_USERS_LOADING_MORE.ACTION,
    payload: {
      promise: ApiClient.searchUsers(userName, user, 15, false, skip),
    },
  });
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
export const UNFOLLOW_SEARCH_USER_WEBSITE = createAsyncActionType(
  '@users/UNFOLLOW_SEARCH_USER_WEBSITE',
);

export const unfollowSearchUser = username => (dispatch, getState, { steemConnectAPI }) => {
  const state = getState();

  if (!getIsAuthenticated(state)) {
    return Promise.reject('User is not authenticated');
  }

  const isWaivio = getIsWaivio(state);

  return dispatch({
    type: isWaivio ? UNFOLLOW_SEARCH_USER.ACTION : UNFOLLOW_SEARCH_USER_WEBSITE.ACTION,
    payload: {
      promise: steemConnectAPI.unfollow(getAuthenticatedUserName(state), username),
    },
    meta: {
      username,
    },
  });
};

export const FOLLOW_SEARCH_USER = createAsyncActionType('@user/FOLLOW_SEARCH_USER');
export const FOLLOW_SEARCH_USER_WEBSITE = createAsyncActionType('@user/FOLLOW_SEARCH_USER_WEBSITE');

export const followSearchUser = username => (dispatch, getState, { steemConnectAPI }) => {
  const state = getState();
  const isWaivio = getIsWaivio(state);

  if (!getIsAuthenticated(state)) {
    return Promise.reject('User is not authenticated');
  }

  return dispatch({
    type: isWaivio ? FOLLOW_SEARCH_USER.ACTION : FOLLOW_SEARCH_USER_WEBSITE.ACTION,
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

export const resetToInitialIsClearSearchObj = () => dispatch =>
  dispatch({
    type: RESET_TO_INITIAL_IS_CLEAR_SEARCH_OBJECTS,
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

export const WEBSITE_SEARCH_TYPE = '@search/WEBSITE_SEARCH_TYPE';

export const setWebsiteSearchType = payload => ({
  type: WEBSITE_SEARCH_TYPE,
  payload,
});

export const SET_WEBSITE_SEARCH_FILTER = '@search/SET_WEBSITE_SEARCH_FILTER';

export const setWebsiteSearchFilter = (category, tag) => ({
  type: SET_WEBSITE_SEARCH_FILTER,
  payload: {
    category,
    tag,
  },
});

export const SET_WEBSITE_SEARCH_STRING = '@search/SET_WEBSITE_SEARCH_STRING';

export const setWebsiteSearchString = searchString => ({
  type: SET_WEBSITE_SEARCH_STRING,
  payload: searchString,
});

export const SET_SEARCH_SORT = '@search/SET_SEARCH_SORT';

export const setSearchSortType = sort => ({
  type: SET_SEARCH_SORT,
  payload: sort,
});

export const SET_SHOW_RESULT = '@search/SET_SHOW_RESULT';

export const setShowSearchResult = payload => ({
  type: SET_SHOW_RESULT,
  payload,
});

export const SET_OWNER_BENEFICIARY = '@search/SET_OWNER_BENEFICIARY';

export const setBeneficiaryOwner = payload => ({ type: SET_OWNER_BENEFICIARY, payload });

export const SET_MAP_FOR_SEARCH = '@search/SET_MAP_FOR_SEARCH';

export const setMapForSearch = payload => ({ type: SET_MAP_FOR_SEARCH, payload });
