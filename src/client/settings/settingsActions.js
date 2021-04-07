import { createAction } from 'redux-actions';
import { saveSettingsMetadata } from '../helpers/metadata';
import { setUserStatus, getVipTicketsInfo } from '../../waivioApi/ApiClient';
import { createAsyncActionType } from '../helpers/stateHelpers';
import {getAuthenticatedUserName, isGuestUser} from '../store/authStore/authSelectors';

export const SAVE_SETTINGS = '@app/SAVE_SETTINGS';
export const SAVE_SETTINGS_START = '@app/SAVE_SETTINGS_START';
export const SAVE_SETTINGS_SUCCESS = '@app/SAVE_SETTINGS_SUCCESS';
export const SAVE_SETTINGS_ERROR = '@app/SAVE_SETTINGS_ERROR';

export const SET_USER_STATUS = createAsyncActionType('@app/SET_USER_STATUS');

export const saveSettings = settings => (dispatch, getState) => {
  const state = getState();
  const userName = getAuthenticatedUserName(state);

  if (!userName) return dispatch({ type: SAVE_SETTINGS_ERROR });

  return dispatch({
    type: SAVE_SETTINGS,
    payload: {
      promise: saveSettingsMetadata(userName, settings),
    },
  });
};

export const setUsersStatus = () => (dispatch, getState) => {
  const state = getState();
  const userName = getAuthenticatedUserName(state);

  dispatch({
    type: SET_USER_STATUS.ACTION,
    payload: {
      promise: setUserStatus(userName),
    },
  });
};

export const OPEN_LINK_MODAL = 'OPEN_LINK_MODAL';

export const openLinkHiveAccountModal = payload => dispatch =>
  dispatch({
    type: OPEN_LINK_MODAL,
    payload,
  });

export const SET_LOCALE = '@app/SET_LOCALE';

export const setLocale = createAction(SET_LOCALE);

export const GET_VIP_TICKETS_INFO = createAsyncActionType('@app/GET_VIP_TICKETS_INFO');

export const getVipTickets = () => (dispatch, getState) => {
  const state = getState();
  const userName = getAuthenticatedUserName(state);
  const isGuest = isGuestUser(state);

  dispatch({
    type: GET_VIP_TICKETS_INFO.ACTION,
    payload: {
      promise: getVipTicketsInfo({ userName }, isGuest),
    },
  });
};
