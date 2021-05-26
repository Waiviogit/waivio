import { GET_MORE_TRANSACTIONS_FOR_TABLE, GET_TRANSACTIONS_FOR_TABLE } from './advancedActions';

const initialState = {
  deposits: 0,
  withdrawals: 0,
  isLoading: false,
  isLoadingMore: false,
  wallet: [],
  loadingAllData: false,
};

export default function advancedReducer(state = initialState, action) {
  switch (action.type) {
    case GET_TRANSACTIONS_FOR_TABLE.START: {
      return {
        ...state,
        isLoading: true,
        loadingAllData: true,
        deposits: 0,
        withdrawals: 0,
        wallet: [],
      };
    }
    case GET_TRANSACTIONS_FOR_TABLE.SUCCESS: {
      const { data } = action.payload;

      return {
        ...state,
        wallet: data.wallet,
        hasMore: data.hasMore,
        withdrawals: data.withdrawals,
        deposits: data.deposits,
        isLoading: false,
        accounts: data.accounts,
        loadingAllData: data.hasMore,
      };
    }
    case GET_MORE_TRANSACTIONS_FOR_TABLE.START: {
      return {
        ...state,
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
        accounts: data.accounts,
        loadingAllData: data.hasMore,
      };
    }
    default:
      return state;
  }
}
