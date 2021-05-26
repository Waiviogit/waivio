import { GET_MORE_TRANSACTIONS_FOR_TABLE, GET_TRANSACTIONS_FOR_TABLE } from './advancedActions';

const initialState = {
  deposits: 0,
  withdrawals: 0,
  isLoading: false,
  isLoadingMore: false,
  wallet: [],
};

export default function advancedReducer(state = initialState, action) {
  switch (action.type) {
    case GET_TRANSACTIONS_FOR_TABLE.START: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case GET_TRANSACTIONS_FOR_TABLE.SUCCESS: {
      const { data } = action.payload;

      return {
        ...state,
        wallet: data.wallet,
        hasMore: data.hasMore,
        withdrawals: state.withdrawals + data.withdrawals,
        deposits: state.deposits + data.deposits,
        isLoading: false,
        accounts: data.accounts,
      };
    }
    case GET_MORE_TRANSACTIONS_FOR_TABLE.START: {
      return {
        ...state,
        isLoadingMore: true,
      };
    }
    case GET_MORE_TRANSACTIONS_FOR_TABLE.SUCCESS: {
      const { data } = action.payload;

      return {
        ...state,
        wallet: [...state.wallet, ...data.wallet],
        hasMore: data.hasMore,
        withdrawals: state.withdrawals + data.withdrawals,
        deposits: state.deposits + data.deposits,
        isLoadingMore: false,
        accounts: data.accounts,
      };
    }
    default:
      return state;
  }
}
