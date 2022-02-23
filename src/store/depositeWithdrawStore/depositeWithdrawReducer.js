import {
  GET_DEPOSIT_WITHDRAW_PAIR,
  RESET_TOKEN_PAIR,
  SET_DEPOSITE_SYMBOL,
  SET_TOKEN_PAIR,
  SET_WITHDRAW_PAIR,
  TOGGLE_WITHDRAW_MODAL,
} from './depositeWithdrawAction';

const initialState = {
  withdrawPairs: [],
  depositPairs: [],
  pair: null,
  withdrawPair: null,
  defaultWithdrawToken: '',
  isOpenWithdraw: false,
  symbol: '',
};

const depositWithdraw = (state = initialState, action) => {
  switch (action.type) {
    case GET_DEPOSIT_WITHDRAW_PAIR.SUCCESS: {
      return {
        ...state,
        withdrawPairs: action.payload.withdrawPairs,
        withdrawPair: state.defaultWithdrawToken
          ? action.payload.withdrawPairs.find(pair => pair.symbol === state.defaultWithdrawToken)
          : action.payload.withdrawPairs[0],
        depositPairs: action.payload.depositPairs,
      };
    }

    case SET_TOKEN_PAIR.START: {
      return {
        ...state,
        pairLoading: true,
      };
    }
    case SET_WITHDRAW_PAIR: {
      return {
        ...state,
        withdrawPair: action.payload,
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
        withdrawPair: null,
        symbol: null,
      };
    }

    case TOGGLE_WITHDRAW_MODAL: {
      return {
        ...state,
        isOpenWithdraw: action.payload.isOpen,
        defaultWithdrawToken: action.payload.token,
      };
    }

    case SET_DEPOSITE_SYMBOL: {
      return {
        ...state,
        symbol: action.payload,
      };
    }
    default:
      return state;
  }
};

export default depositWithdraw;
