import { createAction } from 'redux-actions';
import { saveSettingsMetadata } from '../../common/helpers/metadata';
import { setUserStatus, getVipTicketsInfo, addNoteInVipTicket } from '../../waivioApi/ApiClient';
import { createAsyncActionType } from '../../common/helpers/stateHelpers';
import { getAuthenticatedUserName, isGuestUser } from '../authStore/authSelectors';
import { getVipTicketsQuery } from '../../client/settings/common/helpers';
import { getCurrentCurrencyRate } from '../appStore/appActions';
import { getIsWaivio } from '../appStore/appSelectors';

export const SAVE_SETTINGS = '@app/SAVE_SETTINGS';
export const SAVE_SETTINGS_START = '@app/SAVE_SETTINGS_START';
export const SAVE_SETTINGS_SUCCESS = '@app/SAVE_SETTINGS_SUCCESS';
export const SAVE_SETTINGS_ERROR = '@app/SAVE_SETTINGS_ERROR';

export const SET_USER_STATUS = createAsyncActionType('@app/SET_USER_STATUS');

export const saveSettings = settings => (dispatch, getState) => {
  const state = getState();
  const userName = getAuthenticatedUserName(state);
  const isWaivio = getIsWaivio(state);

  if (!userName) return dispatch({ type: SAVE_SETTINGS_ERROR });

  return dispatch({
    type: SAVE_SETTINGS,
    payload: {
      promise: saveSettingsMetadata(userName, settings).then(res => {
        if (isWaivio) dispatch(getCurrentCurrencyRate(res.currency));

        return res;
      }),
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

export const openLinkHiveAccountModal = payload => ({ type: OPEN_LINK_MODAL, payload });

export const SET_LOCALE = '@app/SET_LOCALE';

export const setLocale = createAction(SET_LOCALE);

export const GET_VIP_TICKETS_INFO = createAsyncActionType('@app/GET_VIP_TICKETS_INFO');

export const getVipTickets = () => (dispatch, getState) => {
  const state = getState();
  const userName = getAuthenticatedUserName(state);
  const isGuest = isGuestUser(state);

  return dispatch({
    type: GET_VIP_TICKETS_INFO.ACTION,
    payload: {
      promise: getVipTicketsInfo({ userName }, isGuest),
    },
  });
};

export const ADD_NOTE_IN_TICKET = createAsyncActionType('@app/ADD_NOTE_IN_TICKET');

export const addNoteInTicket = (ticket, note) => (dispatch, getState) => {
  const state = getState();
  const userName = getAuthenticatedUserName(state);
  const isGuest = isGuestUser(state);

  return dispatch({
    type: ADD_NOTE_IN_TICKET.ACTION,
    payload: {
      promise: addNoteInVipTicket({ ticket, note, userName }, isGuest),
    },
  });
};

export const GET_ACTIVE_VIP_TICKETS_INFO_MORE = createAsyncActionType(
  '@app/GET_ACTIVE_VIP_TICKETS_INFO_MORE',
);
export const GET_CONSUMED_VIP_TICKETS_INFO_MORE = createAsyncActionType(
  '@app/GET_CONSUMED_VIP_TICKETS_INFO_MORE',
);

export const getMoreVipTickets = (isActive, skip, limit = 10) => (dispatch, getState) => {
  const state = getState();
  const userName = getAuthenticatedUserName(state);
  const isGuest = isGuestUser(state);
  const currentType = isActive
    ? GET_ACTIVE_VIP_TICKETS_INFO_MORE
    : GET_CONSUMED_VIP_TICKETS_INFO_MORE;

  return dispatch({
    type: currentType.ACTION,
    payload: {
      promise: getVipTicketsInfo(
        {
          userName,
          ...getVipTicketsQuery(isActive, skip, limit),
        },
        isGuest,
      ),
    },
  });
};
