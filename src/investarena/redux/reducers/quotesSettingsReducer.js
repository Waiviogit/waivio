import { AUTHORIZE_BROKER_SUCCESS, DISCONNECT_BROKER_SUCCESS } from '../actions/brokersActions';
import { UPDATE_QUOTES_SETTINGS } from '../actions/quotesSettingsActions';

const initialState = {};

export default function(state = initialState, action) {
  switch (action.type) {
    case UPDATE_QUOTES_SETTINGS: {
      const quotesSettings = Object.values(action.payload).reduce((acc, curr) => {
        acc[curr.keyName] = { ...curr, name: `${curr.baseCurrency}/${curr.termCurrency}` };
        return acc;
      }, {});
      return { ...state, ...quotesSettings };
    }
    case AUTHORIZE_BROKER_SUCCESS:
    case DISCONNECT_BROKER_SUCCESS:
      return initialState;
    default:
      return state;
  }
}
