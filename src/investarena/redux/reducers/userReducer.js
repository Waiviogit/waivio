// import {
//   CONFIRM_USING_COOKIES,
//   GET_USER_SETTINGS_SUCCESS,
//   UPDATE_SETTINGS_REQUEST,
//   UPDATE_SETTINGS_SUCCESS,
// } from '../actions/userActions';

const initialState = {
  info: {},
  isSignIn: false,
  settings: {},
  isLoading: false,
  connectionEstablished: false,
};

export default function(state = initialState, action) {
  switch (action.type) {
    // case UPDATE_SETTINGS_REQUEST:
    //   return { ...state, isLoading: true };
    // case GET_USER_SETTINGS_SUCCESS:
    //   return { ...state, settings: action.payload };
    // case UPDATE_SETTINGS_SUCCESS:
    //   return {
    //     ...state,
    //     settings: { ...state.settings, ...action.payload },
    //     info: {
    //       ...state.info,
    //       first_name: action.payload.first_name,
    //       last_name: action.payload.last_name,
    //       name: action.payload.name,
    //     },
    //     isLoading: false,
    //   };
    // case CONFIRM_USING_COOKIES:
    //   return { ...state, info: { ...state.info, is_confirmed_cookies: action.payload } };
    default:
      return state;
  }
}
