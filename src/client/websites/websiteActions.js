import { createAsyncActionType } from '../helpers/stateHelpers';
import {
  checkAvailable,
  createWebsite,
  getDomainList,
  getInfoForManagePage,
} from '../../waivioApi/ApiClient';
import { getAuthenticatedUserName, getParentDomain } from '../reducers';
import { message } from 'antd';

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

export const ACTIVATE_WEBSITE = createAsyncActionType('@website/ACTIVATE_WEBSITE');

export const activateWebsite = id => (dispatch, getState, { steemConnectAPI }) => {
  const name = getAuthenticatedUserName(getState());

  dispatch({ type: ACTIVATE_WEBSITE.START, id });
  steemConnectAPI.activateWebsite(name, id);
};

export const SUSPEND_WEBSITE = createAsyncActionType('@website/SUSPEND_WEBSITE');

export const suspendWebsite = id => (dispatch, getState, { steemConnectAPI }) => {
  const name = getAuthenticatedUserName(getState());

  dispatch({ type: SUSPEND_WEBSITE.START, id });
  steemConnectAPI.suspendWebsite(name, id);
};
