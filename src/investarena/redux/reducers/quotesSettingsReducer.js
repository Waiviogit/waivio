import { AUTHORIZE_BROKER_SUCCESS, DISCONNECT_BROKER_SUCCESS } from '../actions/brokersActions';
import { UPDATE_QUOTES_SETTINGS } from '../actions/quotesSettingsActions';

const initialState = {};

export default function(state = initialState, action) {
  switch (action.type) {
    case UPDATE_QUOTES_SETTINGS:
      return { ...state, ...action.payload };
    case AUTHORIZE_BROKER_SUCCESS:
    case DISCONNECT_BROKER_SUCCESS:
        return initialState;
    default:
      return state;
  }
}
