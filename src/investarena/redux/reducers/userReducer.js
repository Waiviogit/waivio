import {
  CONFIRM_USING_COOKIES,
  GET_USER_SETTINGS_SUCCESS,
  UPDATE_SETTINGS_REQUEST,
  UPDATE_SETTINGS_SUCCESS,
} from '../actions/userActions';
// import { REGISTRATION_REQUEST,
//     REGISTRATION_SUCCESS,
//     REGISTRATION_ERROR } from 'redux/actions/entities/authenticate/registration';
// import { RESET_PASSWORD_REQUEST,
//     RESET_PASSWORD_SUCCESS,
//     RESET_PASSWORD_ERROR,
//     CHANGE_PASSWORD_REQUEST,
//     CHANGE_PASSWORD_SUCCESS,
//     CHANGE_PASSWORD_ERROR } from 'redux/actions/entities/authenticate/recover';
// import { SIGN_IN_REQUEST,
//     SIGN_IN_SUCCESS,
//     SIGN_IN_ERROR,
//     SIGN_OUT_REQUEST,
//     SIGN_OUT_SUCCESS,
//     SIGN_OUT_ERROR,
//     SIGN_OUT_ON_UNAUTHORIZED } from 'redux/actions/entities/authenticate/authenticate';
// import { AUTHORIZE_TOKEN_SUCCESS } from 'redux/actions/entities/platformActions';
// import { DISCONNECT_TOKEN_SUCCESS } from 'redux/actions/entities/brokersActions';

const initialState = {
  info: {},
  isSignIn: false,
  settings: {},
  isLoading: false,
  connectionEstablished: false,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case UPDATE_SETTINGS_REQUEST:
      return { ...state, isLoading: true };
    case GET_USER_SETTINGS_SUCCESS:
      return { ...state, settings: action.payload };
    case UPDATE_SETTINGS_SUCCESS:
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
        info: {
          ...state.info,
          first_name: action.payload.first_name,
          last_name: action.payload.last_name,
          name: action.payload.name,
        },
        isLoading: false,
      };
    // case UPDATE_CONFIDENTIALITY_SUCCESS:
    //     return { ...state, settings: {...state.settings, ...action.payload}, isLoading: false };
    case CONFIRM_USING_COOKIES:
      return { ...state, info: { ...state.info, is_confirmed_cookies: action.payload } };
    default:
      return state;
  }
}
