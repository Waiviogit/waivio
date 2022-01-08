import { message } from 'antd';
import { get, isEmpty, size } from 'lodash';

import { createAsyncActionType } from '../../client/helpers/stateHelpers';
import { subscribeMethod, subscribeTypes } from '../../common/constants/blockTypes';
import { getChangesInAccessOption } from '../../client/websites/helper';
import * as ApiClient from '../../waivioApi/ApiClient';
import { getAuthenticatedUserName } from '../authStore/authSelectors';
import { getLocale } from '../settingsStore/settingsSelectors';
import { getSearchFiltersTagCategory, getWebsiteSearchType } from '../searchStore/searchSelectors';
import { getOwnWebsites, getParentDomain } from './websiteSelectors';
import { getLastBlockNum } from '../../client/vendor/steemitHelpers';

export const GET_PARENT_DOMAIN = createAsyncActionType('@website/GET_PARENT_DOMAIN');

export const getParentDomainList = () => ({
  type: GET_PARENT_DOMAIN.ACTION,
  payload: { promise: ApiClient.getDomainList().then(r => r) },
});

export const GET_OWN_WEBSITE = createAsyncActionType('@website/GET_OWN_WEBSITE');

export const getOwnWebsite = () => (dispatch, getState) => {
  const userName = getAuthenticatedUserName(getState());

  return dispatch({
    type: GET_OWN_WEBSITE.ACTION,
    payload: {
      promise: ApiClient.getWebsites(userName),
    },
  });
};

export const CREATE_NEW_WEBSITE = createAsyncActionType('@website/CREATE_NEW_WEBSITE');

export const createNewWebsite = (formData, history) => (dispatch, getState, { busyAPI }) => {
  const state = getState();
  const domainList = getParentDomain(state);
  const owner = getAuthenticatedUserName(state);
  const body = {
    name: formData.domain,
    parentId: domainList[formData.parent],
    owner,
  };

  dispatch({ type: CREATE_NEW_WEBSITE.START });

  ApiClient.createWebsite(body).then(async res => {
    if (res.message) message.error(res.message);
    else {
      const blockNumber = await getLastBlockNum();
      const creator = getAuthenticatedUserName(state);

      busyAPI.instance.sendAsync(subscribeMethod, [creator, blockNumber, subscribeTypes.posts]);
      busyAPI.instance.subscribeBlock(subscribeTypes.posts, blockNumber, () => {
        dispatch(getOwnWebsite());
        dispatch({ type: CREATE_NEW_WEBSITE.SUCCESS });
        history.push(`/${formData.domain}.${formData.parent}/configuration`);
      });
    }
  });
};

export const CHECK_AVAILABLE_DOMAIN = createAsyncActionType('@website/CHECK_AVAILABLE_DOMAIN');

export const checkAvailableDomain = (name, parent) => ({
  type: CHECK_AVAILABLE_DOMAIN.ACTION,
  payload: {
    promise: ApiClient.checkAvailable(name, parent)
      .then(r => r.status)
      .catch(e => e),
  },
});

export const GET_INFO_FOR_MANAGE_PAGE = createAsyncActionType('@website/GET_INFO_FOR_MANAGE_PAGE');

export const getManageInfo = name => ({
  type: GET_INFO_FOR_MANAGE_PAGE.ACTION,
  payload: {
    promise: ApiClient.getInfoForManagePage(name)
      .then(r => r.json())
      .then(r => r)
      .catch(e => message.error(e.message)),
  },
});

export const CHANGE_STATUS_WEBSITE = '@website/CHANGE_STATUS_WEBSITE';

export const activateWebsite = id => (dispatch, getState, { steemConnectAPI, busyAPI }) => {
  const name = getAuthenticatedUserName(getState());

  dispatch({ type: CHANGE_STATUS_WEBSITE, id });
  steemConnectAPI.activateWebsite(name, id).then(async () => {
    const blockNumber = await getLastBlockNum();

    busyAPI.instance.sendAsync(subscribeMethod, [name, blockNumber, subscribeTypes.posts]);
    busyAPI.instance.subscribe((response, mess) => {
      if (subscribeTypes.posts === mess.type && mess.notification.blockParsed === blockNumber) {
        dispatch(getManageInfo(name));
      }
    });
  });
};

export const suspendWebsite = id => (dispatch, getState, { steemConnectAPI, busyAPI }) => {
  const name = getAuthenticatedUserName(getState());

  dispatch({ type: CHANGE_STATUS_WEBSITE, id });
  steemConnectAPI.suspendWebsite(name, id).then(async () => {
    const blockNumber = await getLastBlockNum();

    busyAPI.instance.sendAsync(subscribeMethod, [name, blockNumber, subscribeTypes.posts]);
    busyAPI.instance.subscribe((response, mess) => {
      if (subscribeTypes.posts === mess.type && mess.notification.blockParsed === blockNumber) {
        dispatch(getManageInfo(name));
      }
    });
  });
};

export const DELETE_WEBSITE = '@website/DELETE_WEBSITE';
export const DELETE_WEBSITE_ERROR = '@website/DELETE_WEBSITE_ERROR';

export const deleteWebsite = item => (dispatch, getState, { busyAPI }) => {
  const name = getAuthenticatedUserName(getState());

  dispatch({ type: DELETE_WEBSITE, id: item.host });

  return ApiClient.deleteSite(name, item.host)
    .then(async res => {
      if (res.result) {
        const blockNumber = await getLastBlockNum();

        busyAPI.instance.sendAsync(subscribeMethod, [name, blockNumber, subscribeTypes.posts]);
        busyAPI.instance.subscribe((response, mess) => {
          if (subscribeTypes.posts === mess.type && mess.notification.blockParsed === blockNumber) {
            dispatch(getManageInfo(name));
            dispatch(getOwnWebsite());
          }
        });
      } else {
        dispatch({ type: DELETE_WEBSITE_ERROR, id: item.host });
      }

      return res;
    })
    .catch(e => {
      message.error(e.message);
      dispatch({ type: DELETE_WEBSITE_ERROR, id: item.host });
    });
};

export const GET_REPORTS_PAGE = createAsyncActionType('@website/GET_REPORTS_PAGE');

export const getReportsWebsiteInfo = (formData = {}) => (dispatch, getState) => {
  const userName = getAuthenticatedUserName(getState());

  dispatch({
    type: GET_REPORTS_PAGE.ACTION,
    payload: {
      promise: ApiClient.getWebsitesReports({ userName, ...formData }),
    },
  });
};
export const GET_WEBSITE_CONFIGURATIONS = createAsyncActionType(
  '@website/GET_WEBSITE_CONFIGURATIONS',
);

export const getWebConfiguration = site => ({
  type: GET_WEBSITE_CONFIGURATIONS.ACTION,
  payload: {
    promise: ApiClient.getWebsitesConfiguration(site),
  },
});

export const SAVE_WEBSITE_CONFIGURATIONS = createAsyncActionType(
  '@website/SAVE_WEBSITE_CONFIGURATIONS',
);

export const saveWebConfiguration = (host, configuration) => (dispatch, getState) => {
  const userName = getAuthenticatedUserName(getState());

  return dispatch({
    type: SAVE_WEBSITE_CONFIGURATIONS.ACTION,
    payload: {
      promise: ApiClient.saveWebsitesConfiguration({
        userName,
        host,
        configuration: {
          ...configuration,
        },
      }),
    },
  });
};

export const GET_WEBSITE_ADMINISTRATORS = createAsyncActionType(
  '@website/GET_WEBSITE_ADMINISTRATORS',
);

export const getWebAdministrators = host => (dispatch, getState) => {
  const userName = getAuthenticatedUserName(getState());

  dispatch({
    type: GET_WEBSITE_ADMINISTRATORS.ACTION,
    payload: {
      promise: ApiClient.getWebsiteAdministrators(host, userName),
    },
  });
};

export const ADD_WEBSITE_ADMINISTRATOR = createAsyncActionType(
  '@website/ADD_WEBSITE_ADMINISTRATOR',
);

export const addWebAdministrator = (host, account) => (dispatch, getState, { steemConnectAPI }) => {
  const userName = getAuthenticatedUserName(getState());

  dispatch({
    type: ADD_WEBSITE_ADMINISTRATOR.START,
    payload: account,
  });

  steemConnectAPI
    .addWebsiteAdministrators(userName, host, [account.name])
    .then(async res => {
      if (!res.message) {
        return dispatch(
          getChangesInAccessOption(
            userName,
            host,
            ADD_WEBSITE_ADMINISTRATOR,
            ApiClient.getWebsiteAdministrators,
          ),
        );
      }

      return dispatch({
        type: ADD_WEBSITE_ADMINISTRATOR.ERROR,
      });
    })
    .catch(() =>
      dispatch({
        type: ADD_WEBSITE_ADMINISTRATOR.ERROR,
      }),
    );
};

export const DELETE_WEBSITE_ADMINISTRATOR = createAsyncActionType(
  '@website/DELETE_WEBSITE_ADMINISTRATOR',
);

export const deleteWebAdministrator = (host, name) => (dispatch, getState, { steemConnectAPI }) => {
  const userName = getAuthenticatedUserName(getState());

  dispatch({
    type: DELETE_WEBSITE_ADMINISTRATOR.START,
    payload: name,
  });

  steemConnectAPI.deleteWebsiteAdministrators(userName, host, [name]).then(() =>
    dispatch({
      type: DELETE_WEBSITE_ADMINISTRATOR.SUCCESS,
      payload: name,
    }),
  );
};

export const GET_WEBSITE_MODERATORS = createAsyncActionType('@website/GET_WEBSITE_MODERATORS');

export const getWebModerators = host => (dispatch, getState) => {
  const userName = getAuthenticatedUserName(getState());

  dispatch({
    type: GET_WEBSITE_MODERATORS.ACTION,
    payload: {
      promise: ApiClient.getWebsiteModerators(host, userName),
    },
  });
};

export const ADD_WEBSITE_MODERATORS = createAsyncActionType('@website/ADD_WEBSITE_MODERATORS');

export const addWebsiteModerators = (host, account) => (
  dispatch,
  getState,
  { steemConnectAPI },
) => {
  const userName = getAuthenticatedUserName(getState());

  dispatch({
    type: ADD_WEBSITE_MODERATORS.START,
    payload: account,
  });

  steemConnectAPI
    .addWebsiteModerators(userName, host, [account.name])
    .then(async res => {
      if (!res.message) {
        return dispatch(
          getChangesInAccessOption(
            userName,
            host,
            ADD_WEBSITE_MODERATORS,
            ApiClient.getWebsiteModerators,
          ),
        );
      }

      return dispatch({
        type: ADD_WEBSITE_MODERATORS.ERROR,
      });
    })
    .catch(() =>
      dispatch({
        type: ADD_WEBSITE_MODERATORS.ERROR,
      }),
    );
};

export const DELETE_WEBSITE_MODERATORS = createAsyncActionType(
  '@website/DELETE_WEBSITE_MODERATORS',
);

export const deleteWebModerators = (host, name) => (dispatch, getState, { steemConnectAPI }) => {
  const userName = getAuthenticatedUserName(getState());

  dispatch({
    type: DELETE_WEBSITE_MODERATORS.START,
    payload: name,
  });

  steemConnectAPI.deleteWebsiteModerators(userName, host, [name]).then(() =>
    dispatch({
      type: DELETE_WEBSITE_MODERATORS.SUCCESS,
      payload: name,
    }),
  );
};

export const GET_WEBSITE_AUTHORITIES = createAsyncActionType('@website/GET_WEBSITE_AUTHORITIES');

export const getWebAuthorities = host => (dispatch, getState) => {
  const userName = getAuthenticatedUserName(getState());

  dispatch({
    type: GET_WEBSITE_AUTHORITIES.ACTION,
    payload: {
      promise: ApiClient.getWebsiteAuthorities(host, userName),
    },
  });
};

export const ADD_WEBSITE_AUTHORITIES = createAsyncActionType('@website/ADD_WEBSITE_AUTHORITIES');

export const addWebAuthorities = (host, account) => (dispatch, getState, { steemConnectAPI }) => {
  const userName = getAuthenticatedUserName(getState());

  dispatch({
    type: ADD_WEBSITE_AUTHORITIES.START,
    payload: account,
  });

  steemConnectAPI
    .addWebsiteAuthorities(userName, host, [account.name])
    .then(async res => {
      if (!res.message) {
        return dispatch(
          getChangesInAccessOption(
            userName,
            host,
            ADD_WEBSITE_AUTHORITIES,
            ApiClient.getWebsiteAuthorities,
          ),
        );
      }

      return dispatch({
        type: ADD_WEBSITE_AUTHORITIES.ERROR,
      });
    })
    .catch(() =>
      dispatch({
        type: ADD_WEBSITE_AUTHORITIES.ERROR,
      }),
    );
};

export const DELETE_WEBSITE_AUTHORITIES = createAsyncActionType(
  '@website/DELETE_WEBSITE_AUTHORITIES',
);

export const deleteWebAuthorities = (host, name) => (dispatch, getState, { steemConnectAPI }) => {
  const userName = getAuthenticatedUserName(getState());

  dispatch({
    type: DELETE_WEBSITE_AUTHORITIES.START,
    payload: name,
  });

  steemConnectAPI.deleteWebsiteAuthorities(userName, host, [name]).then(() =>
    dispatch({
      type: DELETE_WEBSITE_AUTHORITIES.SUCCESS,
      payload: name,
    }),
  );
};

export const SAVE_WEBSITE_SETTINGS = createAsyncActionType('@website/SAVE_WEBSITE_SETTINGS');

export const saveWebsiteSettings = (host, googleAnalyticsTag, beneficiary, currency, language) => (
  dispatch,
  getState,
  { steemConnectAPI },
) => {
  const state = getState();
  const userName = getAuthenticatedUserName(state);
  const currentWebsite = getOwnWebsites(state).find(web => web.host === host);

  dispatch({
    type: SAVE_WEBSITE_SETTINGS.ACTION,
    payload: {
      promise: steemConnectAPI.saveWebsiteSettings(
        userName,
        get(currentWebsite, 'id'),
        googleAnalyticsTag,
        beneficiary,
        currency,
        language,
      ),
    },
  });
};

export const GET_WEBSITE_TAGS = createAsyncActionType('@website/GET_WEBSITE_TAGS');

export const getWebsiteTags = host => (dispatch, getState) => {
  const state = getState();
  const userName = getAuthenticatedUserName(state);

  dispatch({
    type: GET_WEBSITE_TAGS.ACTION,
    payload: {
      promise: ApiClient.getTagCategoryForSite(host, userName),
    },
  });
};

export const saveTagsCategoryForSite = (host, objectsFilter) => (dispatch, getState) => {
  const state = getState();
  const userName = getAuthenticatedUserName(state);

  dispatch({
    type: GET_WEBSITE_TAGS.ACTION,
    payload: {
      promise: ApiClient.saveTagCategoryForSite(host, userName, objectsFilter),
    },
  });
};

export const GET_COORDINATES_FOG_MAP = createAsyncActionType('@website/GET_COORDINATES_FOG_MAP');

export const getCoordinatesForMap = (coordinates, radius) => (dispatch, getState) => {
  const userName = getAuthenticatedUserName(getState());

  return dispatch({
    type: GET_COORDINATES_FOG_MAP.ACTION,
    payload: {
      promise: ApiClient.getObjectType('restaurant', {
        simplified: true,
        userName,
        wobjects_count: 50,
        wobjects_skip: 0,
        filter: {
          map: {
            coordinates,
            radius,
          },
        },
      }),
    },
  });
};

export const GET_WEBSITE_SETTINGS = createAsyncActionType('@website/GET_WEBSITE_SETTINGS');

export const getWebsiteSettings = host => ({
  type: GET_WEBSITE_SETTINGS.ACTION,
  payload: {
    promise: ApiClient.getSettingsWebsite(host),
  },
});

export const SET_WEBSITE_OBJECTS_COORDINATES = createAsyncActionType(
  '@website/SET_WEBSITE_OBJECTS_COORDINATES',
);

export const setWebsiteObjectsCoordinates = params => ({
  type: SET_WEBSITE_OBJECTS_COORDINATES.ACTION,
  payload: {
    promise: ApiClient.setWebsiteObjCoordinates(params),
  },
});

export const GET_WEBSITE_OBJECTS_COORDINATES = createAsyncActionType(
  '@website/GET_WEBSITE_OBJECTS_COORDINATES',
);

export const getWebsiteObjectsCoordinates = params => ({
  type: GET_WEBSITE_OBJECTS_COORDINATES.ACTION,
  payload: {
    promise: ApiClient.getWebsiteObjCoordinates(params),
  },
});

export const GET_WEBSITE_OBJECTS_WITH_COORDINATES = createAsyncActionType(
  '@website/GET_WEBSITE_OBJECTS_WITH_COORDINATES',
);

export const getWebsiteObjWithCoordinates = (searchString, box = {}, limit = 70) => (
  dispatch,
  getState,
) => {
  const state = getState();
  const locale = getLocale(state);
  const objType = getWebsiteSearchType(state);
  const userName = getAuthenticatedUserName(state);
  const tagsFilter = getSearchFiltersTagCategory(state);
  const tagCategory = isEmpty(tagsFilter) ? {} : { tagCategory: tagsFilter };
  const userType = objType === 'Users';
  const body = {
    userName,
    ...tagCategory,
    box,
  };

  if (!searchString) body.mapMarkers = true;

  if (userType) {
    return dispatch({
      type: GET_WEBSITE_OBJECTS_WITH_COORDINATES.ACTION,
      payload: ApiClient.getPostsForMap({
        box,
        limit,
      }),
    });
  }

  return dispatch({
    type: GET_WEBSITE_OBJECTS_WITH_COORDINATES.ACTION,
    payload: ApiClient.searchObjects(searchString, objType, false, limit, locale, body),
    meta: Boolean(searchString || !isEmpty(tagsFilter)),
  });
};

export const RESET_WEBSITE_OBJECTS_COORDINATES = '@website/RESET_WEBSITE_OBJECTS_COORDINATES';

export const resetWebsiteObjectsCoordinates = () => ({
  type: RESET_WEBSITE_OBJECTS_COORDINATES,
});

export const GET_WEBSITE_RESTRICTIONS = createAsyncActionType('@website/GET_WEBSITE_RESTRICTIONS');

export const getWebsiteRestrictions = (host, userName) => ({
  type: GET_WEBSITE_RESTRICTIONS.ACTION,
  payload: {
    promise: ApiClient.getRestrictionsInfo(host, userName),
  },
});

export const MUTE_USER = createAsyncActionType('@website/MUTE_USER');
export const UNMUTE_USER = createAsyncActionType('@website/UNMUTE_USER');

export const muteUser = (follower, following, action, host) => (
  dispatch,
  getState,
  { steemConnectAPI },
) => {
  const type = size(action) ? MUTE_USER : UNMUTE_USER;

  dispatch({
    type: type.START,
    meta: following,
  });

  return steemConnectAPI.muteUser(follower, following, action).then(() => {
    dispatch(
      getChangesInAccessOption(follower, host, type, ApiClient.getRestrictionsInfo, {
        following,
      }),
    );
  });
};

export const REFERRAL_USER = createAsyncActionType('@website/REFERRAL_USER');

export const referralUserForWebsite = (account, host) => (
  dispatch,
  getState,
  { steemConnectAPI },
) => {
  const owner = getAuthenticatedUserName(getState());

  return steemConnectAPI.websitesReferral(account, host, owner);
};

export const SET_SHOW_RELOAD = '@website/SET_SHOW_RELOAD';

export const setShowReload = payload => ({
  type: SET_SHOW_RELOAD,
  payload,
});

export const GET_DISTRICTS = createAsyncActionType('@website/GET_DISTRICTS');

export const getDistricts = () => ({
  type: GET_DISTRICTS.ACTION,
  payload: ApiClient.getDistrictsWithCount(),
});

export const GET_RESTAURANTS = createAsyncActionType('@website/GET_RESTAURANTS');

export const getRestaurants = () => ({
  type: GET_RESTAURANTS.ACTION,
  payload: ApiClient.getTypesPrefetch(['restaurant']),
});

export const GET_NEARBY_FOOD = createAsyncActionType('@website/GET_NEARBY_FOOD');

export const getNearbyFood = () => ({
  type: GET_NEARBY_FOOD.ACTION,
  payload: ApiClient.getTypesPrefetch(['dish', 'drink']),
});
