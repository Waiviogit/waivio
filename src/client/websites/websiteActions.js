import { message } from 'antd';
import { get, size } from 'lodash';
import { createAsyncActionType } from '../helpers/stateHelpers';
import {
  checkAvailable,
  createWebsite,
  deleteSite,
  getDomainList,
  getInfoForManagePage,
  getObjectType,
  getSettingsWebsite,
  getTagCategoryForSite,
  getWebsiteAdministrators,
  getWebsiteAuthorities,
  getWebsiteModerators,
  getWebsites,
  getWebsitesConfiguration,
  getWebsitesReports,
  saveTagCategoryForSite,
  saveWebsitesConfiguration,
  setWebsiteObjCoordinates,
  getWebsiteObjCoordinates,
  getRestrictionsInfo,
} from '../../waivioApi/ApiClient';
import { getAuthenticatedUserName, getOwnWebsites, getParentDomain } from '../reducers';
import { subscribeMethod, subscribeTypes } from '../../common/constants/blockTypes';
import { getChangesInAccessOption } from './helper';

export const GET_PARENT_DOMAIN = createAsyncActionType('@website/GET_PARENT_DOMAIN');

export const getParentDomainList = () => ({
  type: GET_PARENT_DOMAIN.ACTION,
  payload: { promise: getDomainList().then(r => r) },
});

export const GET_OWN_WEBSITE = createAsyncActionType('@website/GET_OWN_WEBSITE');

export const getOwnWebsite = () => (dispatch, getState) => {
  const userName = getAuthenticatedUserName(getState());

  return dispatch({
    type: GET_OWN_WEBSITE.ACTION,
    payload: {
      promise: getWebsites(userName),
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

  return dispatch({
    type: CREATE_NEW_WEBSITE.ACTION,
    payload: {
      promise: createWebsite(body).then(res => {
        const { block_num: blockNum } = res.result;
        const creator = getAuthenticatedUserName(state);

        busyAPI.sendAsync(subscribeMethod, [creator, blockNum, subscribeTypes.posts]);
        busyAPI.subscribe((response, mess) => {
          if (subscribeTypes.posts === mess.type && mess.notification.blockParsed === blockNum) {
            history.push(`/${formData.domain}.${formData.parent}/configuration`);
            dispatch(getOwnWebsite());
          }
        });
      }),
    },
  });
};

export const CHECK_AVAILABLE_DOMAIN = createAsyncActionType('@website/CHECK_AVAILABLE_DOMAIN');

export const checkAvailableDomain = (name, parent) => ({
  type: CHECK_AVAILABLE_DOMAIN.ACTION,
  payload: {
    promise: checkAvailable(name, parent)
      .then(r => r.status)
      .catch(e => e),
  },
});

export const GET_INFO_FOR_MANAGE_PAGE = createAsyncActionType('@website/GET_INFO_FOR_MANAGE_PAGE');

export const getManageInfo = name => ({
  type: GET_INFO_FOR_MANAGE_PAGE.ACTION,
  payload: {
    promise: getInfoForManagePage(name)
      .then(r => r.json())
      .then(r => r)
      .catch(e => message.error(e.message)),
  },
});

export const CHANGE_STATUS_WEBSITE = '@website/CHANGE_STATUS_WEBSITE';

export const activateWebsite = id => (dispatch, getState, { steemConnectAPI, busyAPI }) => {
  const name = getAuthenticatedUserName(getState());

  dispatch({ type: CHANGE_STATUS_WEBSITE, id });
  steemConnectAPI.activateWebsite(name, id).then(res => {
    busyAPI.sendAsync(subscribeMethod, [name, res.result.block_num, subscribeTypes.posts]);
    busyAPI.subscribe((response, mess) => {
      if (
        subscribeTypes.posts === mess.type &&
        mess.notification.blockParsed === res.result.block_num
      ) {
        dispatch(getManageInfo(name));
      }
    });
  });
};

export const suspendWebsite = id => (dispatch, getState, { steemConnectAPI, busyAPI }) => {
  const name = getAuthenticatedUserName(getState());

  dispatch({ type: CHANGE_STATUS_WEBSITE, id });
  steemConnectAPI.suspendWebsite(name, id).then(res => {
    busyAPI.sendAsync(subscribeMethod, [name, res.result.block_num, subscribeTypes.posts]);
    busyAPI.subscribe((response, mess) => {
      if (
        subscribeTypes.posts === mess.type &&
        mess.notification.blockParsed === res.result.block_num
      ) {
        dispatch(getManageInfo(name));
      }
    });
  });
};

export const DELETE_WEBSITE = '@website/DELETE_WEBSITE';

export const deleteWebsite = item => (dispatch, getState, { busyAPI }) => {
  const name = getAuthenticatedUserName(getState());

  dispatch({ type: DELETE_WEBSITE, id: item.host });
  deleteSite(name, item.host).then(res => {
    busyAPI.sendAsync(subscribeMethod, [name, res.result.block_num, subscribeTypes.posts]);
    busyAPI.subscribe((response, mess) => {
      if (
        subscribeTypes.posts === mess.type &&
        mess.notification.blockParsed === res.result.block_num
      ) {
        dispatch(getManageInfo(name));
        dispatch(getOwnWebsite());
      }
    });
  });
};

export const GET_REPORTS_PAGE = createAsyncActionType('@website/GET_REPORTS_PAGE');

export const getReportsWebsiteInfo = (formData = {}) => (dispatch, getState) => {
  const userName = getAuthenticatedUserName(getState());

  dispatch({
    type: GET_REPORTS_PAGE.ACTION,
    payload: {
      promise: getWebsitesReports({ userName, ...formData }),
    },
  });
};
export const GET_WEBSITE_CONFIGURATIONS = createAsyncActionType(
  '@website/GET_WEBSITE_CONFIGURATIONS',
);

export const getWebConfiguration = site => ({
  type: GET_WEBSITE_CONFIGURATIONS.ACTION,
  payload: {
    promise: getWebsitesConfiguration(site),
  },
});

export const SAVE_WEBSITE_CONFIGURATIONS = createAsyncActionType(
  '@website/SAVE_WEBSITE_CONFIGURATIONS',
);

export const saveWebConfiguration = (host, configuration) => (dispatch, getState) => {
  const userName = getAuthenticatedUserName(getState());

  dispatch({
    type: SAVE_WEBSITE_CONFIGURATIONS.ACTION,
    payload: {
      promise: saveWebsitesConfiguration({
        userName,
        host,
        ...configuration,
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
      promise: getWebsiteAdministrators(host, userName),
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
        const data = await res.result;
        return dispatch(
          getChangesInAccessOption(
            get(data, 'block_num'),
            userName,
            host,
            ADD_WEBSITE_ADMINISTRATOR,
            getWebsiteAdministrators,
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
      promise: getWebsiteModerators(host, userName),
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
        const data = await res.result;
        return dispatch(
          getChangesInAccessOption(
            get(data, 'block_num'),
            userName,
            host,
            ADD_WEBSITE_MODERATORS,
            getWebsiteModerators,
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
      promise: getWebsiteAuthorities(host, userName),
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
        const data = await res.result;
        return dispatch(
          getChangesInAccessOption(
            get(data, 'block_num'),
            userName,
            host,
            ADD_WEBSITE_AUTHORITIES,
            getWebsiteAuthorities,
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

export const saveWebsiteSettings = (host, googleAnalyticsTag, beneficiary) => (
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
        currentWebsite.id,
        googleAnalyticsTag,
        beneficiary,
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
      promise: getTagCategoryForSite(host, userName),
    },
  });
};

export const saveTagsCategoryForSite = (host, objectsFilter) => (dispatch, getState) => {
  const state = getState();
  const userName = getAuthenticatedUserName(state);

  dispatch({
    type: GET_WEBSITE_TAGS.ACTION,
    payload: {
      promise: saveTagCategoryForSite(host, userName, objectsFilter),
    },
  });
};

export const GET_COORDINATES_FOG_MAP = createAsyncActionType('@website/GET_COORDINATES_FOG_MAP');

export const getCoordinatesForMap = (coordinates, radius) => (dispatch, getState) => {
  const userName = getAuthenticatedUserName(getState());

  return dispatch({
    type: GET_COORDINATES_FOG_MAP.ACTION,
    payload: {
      promise: getObjectType('restaurant', {
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
    promise: getSettingsWebsite(host),
  },
});

export const SET_WEBSITE_OBJECTS_COORDINATES = createAsyncActionType(
  '@website/SET_WEBSITE_OBJECTS_COORDINATES',
);

export const setWebsiteObjectsCoordinates = params => ({
  type: SET_WEBSITE_OBJECTS_COORDINATES.ACTION,
  payload: {
    promise: setWebsiteObjCoordinates(params),
  },
});

export const GET_WEBSITE_OBJECTS_COORDINATES = createAsyncActionType(
  '@website/GET_WEBSITE_OBJECTS_COORDINATES',
);

export const getWebsiteObjectsCoordinates = params => ({
  type: GET_WEBSITE_OBJECTS_COORDINATES.ACTION,
  payload: {
    promise: getWebsiteObjCoordinates(params),
  },
});

export const GET_WEBSITE_RESTRICTIONS = createAsyncActionType('@website/GET_WEBSITE_RESTRICTIONS');

export const getWebsiteRestrictions = (host, userName) => ({
  type: GET_WEBSITE_RESTRICTIONS.ACTION,
  payload: {
    promise: getRestrictionsInfo(host, userName),
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

  return steemConnectAPI.muteUser(follower, following, action).then(data => {
    dispatch(
      getChangesInAccessOption(
        get(data, ['result', 'block_num']),
        follower,
        host,
        type,
        getRestrictionsInfo,
        {
          following,
        },
      ),
    );
  });
};
