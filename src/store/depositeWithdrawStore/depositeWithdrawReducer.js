import {
  GET_DEPOSIT_WITHDRAW_PAIR,
  RESET_TOKEN_PAIR,
  SET_TOKEN_PAIR,
} from './depositeWithdrawAction';

const initialState = {
  withdrawPair: [],
  depositPair: [],
  pair: null,
};

const depositWithdraw = (state = initialState, action) => {
  switch (action.type) {
    case GET_DEPOSIT_WITHDRAW_PAIR.SUCCESS: {
      return {
        withdrawPair: action.payload.filter(
          pair =>
            pair.from_coin_symbol.startsWith('SWAP') && !pair.to_coin_symbol.startsWith('SWAP'),
        ),
        depositPair: action.payload.filter(
          pair =>
            !pair.from_coin_symbol.startsWith('SWAP') && pair.to_coin_symbol.startsWith('SWAP'),
        ),
      };
    }

    case SET_TOKEN_PAIR.START: {
      return {
        ...state,
        pairLoading: true,
      };
    }

    case SET_TOKEN_PAIR.ERROR: {
      return {
        ...state,
        pairLoading: false,
      };
    }

    case SET_TOKEN_PAIR.SUCCESS: {
      return {
        ...state,
        pair: action.payload,
        pairLoading: false,
      };
    }

    case RESET_TOKEN_PAIR: {
      return {
        ...state,
        pair: null,
      };
    }
    default:
      return state;
  }
};

export default depositWithdraw;
