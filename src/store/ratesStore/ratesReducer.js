import { GET_RATES } from './ratesAction';

const defaultState = {
  rates: {},
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case GET_RATES.SUCCESS:
      return {
        ...state,
        rates: { ...action.payload, ...state.rates },
      };
    default:
      return state;
  }
};
