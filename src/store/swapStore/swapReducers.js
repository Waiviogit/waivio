import * as swapActions from './swapActions';

const initialState = {
  swapList: [],
  swapListTo: [],
  swapListFrom: [],
  impact: 0.5,
  visible: false,
  from: { symbol: 'WAIV' },
  to: { symbol: 'SWAP.HIVE' },
};

export default function swapReducer(state = initialState, action) {
  switch (action.type) {
    case swapActions.GET_SWAP_LIST.SUCCESS: {
      return {
        ...state,
        swapList: action.payload.list,
        swapListTo: action.payload.to,
        swapListFrom: action.payload.from.filter(
          token => (token.balance > 0 && token.symbol !== 'WAIV') || token.symbol === 'WAIV',
        ),
        from: action.payload.from.find(token => token.symbol === 'WAIV'),
        to: action.payload.to.find(token => token.symbol === 'SWAP.HIVE'),
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
      };
    }

    case swapActions.SHOW_MODAL: {
      return {
        ...state,
        visible: action.payload,
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
