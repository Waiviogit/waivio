import { message } from 'antd';

import { createAsyncActionType } from '../helpers/stateHelpers';
import {
  checkAvailable,
  createWebsite,
  deleteSite,
  getDomainList,
  getInfoForManagePage,
  getWebsitesReports,
  // getWebsitesReports,
} from '../../waivioApi/ApiClient';
import { getAuthenticatedUserName, getParentDomain } from '../reducers';
import { subscribeMethod, subscribeTypes } from '../../common/constants/blockTypes';

export const GET_PARENT_DOMAIN = createAsyncActionType('@website/GET_PARENT_DOMAIN');

export const getParentDomainList = () => ({
  type: GET_PARENT_DOMAIN.ACTION,
  payload: { promise: getDomainList().then(r => r) },
});

export const CREATE_NEW_WEBSITE = createAsyncActionType('@website/CREATE_NEW_WEBSITE');

export const createNewWebsite = formData => (dispatch, getState) => {
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
      promise: createWebsite(body),
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
