import { createAction } from 'redux-actions';
import { saveSettingsMetadata } from '../helpers/metadata';
import { getAuthenticatedUserName } from '../reducers';

export const SAVE_SETTINGS = '@app/SAVE_SETTINGS';
export const SAVE_SETTINGS_START = '@app/SAVE_SETTINGS_START';
export const SAVE_SETTINGS_SUCCESS = '@app/SAVE_SETTINGS_SUCCESS';
export const SAVE_SETTINGS_ERROR = '@app/SAVE_SETTINGS_ERROR';

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
export const SET_LOCALE = '@app/SET_LOCALE';

export const setLocale = createAction(SET_LOCALE);
