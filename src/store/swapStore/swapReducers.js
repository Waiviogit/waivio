import * as swapActions from './swapActions';

const initialState = {
  swapList: {},
  swapListTo: [],
  swapListFrom: [],
  impact: 0.5,
  visible: false,
  bdPair: '',
  from: { symbol: 'WAIV' },
  to: {},
  visibleConvert: false,
};

export default function swapReducer(state = initialState, action) {
  switch (action.type) {
    case swapActions.GET_SWAP_LIST.SUCCESS: {
      return {
        ...state,
        swapList: action.payload.list,
        swapListTo: action.payload.toList,
        swapListFrom: action.payload.fromList.filter(
          token => (token.balance > 0 && token.symbol !== 'WAIV') || token.symbol === 'WAIV',
        ),
        from: action.payload.from,
        to: action.payload.to,
      };
    }

    case swapActions.SET_FROM_TOKEN: {
      return {
        ...state,
        from: action.payload.token,
        swapListTo: action.payload.list || state.swapListFrom,
        to: {},
      };
    }

    case swapActions.SET_TO_TOKEN: {
      return {
        ...state,
        to: action.payload.token,
        from: {
          ...action.payload.tokenFrom,
          rate: state.from.rate,
          balance: state.from.balance,
        },
      };
    }

    case swapActions.SET_BOTH_TOKENS: {
      return {
        ...state,
        to: action.payload.tokenTo,
        from: action.payload.tokenFrom,
      };
    }

    case swapActions.SHOW_MODAL: {
      return {
        ...state,
        visible: action.payload.isOpen,
        from: action.payload.symbol ? { symbol: action.payload.symbol } : state.from,
        to: action.payload.to ? { symbol: action.payload.to } : state.to,
        bdPair: '',
      };
    }
    case swapActions.SHOW_CONVERT_HBD_MODAL: {
      return {
        ...state,
        visibleConvert: action.payload.isOpen,
        from: action.payload.symbol ? { symbol: action.payload.symbol } : state.from,
        to: action.payload.to ? { symbol: action.payload.to } : state.to,
      };
    }

    case swapActions.SHOW_MODAL_IN_REBALANCE: {
      return {
        ...state,
        visible: action.payload.isOpen,
        bdPair: action.payload.bdPair,
      };
    }

    case swapActions.CHANGED_TOKENS.START: {
      return {
        ...state,
        isChanging: true,
      };
    }

    case swapActions.CHANGED_TOKENS.ERROR: {
      return {
        ...state,
        isChanging: false,
      };
    }

    case swapActions.CHANGED_TOKENS.SUCCESS: {
      return {
        ...state,
        from: state.to,
        swapListTo: action.list,
        to: state.from,
        isChanging: false,
      };
    }

    case swapActions.RESET_MODAL_DATA: {
      return initialState;
    }

    default: {
      return state;
    }
  }
}
