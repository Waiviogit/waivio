import {
  CALCULATE_TOTAL_CHANGES,
  DELETE_USERS_CREATION_DATE,
  GET_MORE_TRANSACTIONS_FOR_TABLE,
  GET_TRANSACTIONS_FOR_TABLE,
  GET_USERS_CREATION_DATE,
  RESET_REPORTS,
} from './advancedActions';
import { totalType } from '../../../common/constants/advansedReports';

const initialState = {
  deposits: 0,
  withdrawals: 0,
  isLoading: false,
  isLoadingMore: false,
  wallet: [],
  loadingAllData: false,
  creationDate: [],
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
        accounts: [],
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

    case GET_USERS_CREATION_DATE.SUCCESS: {
      return {
        ...state,
        creationDate: [...state.creationDate, action.payload],
      };
    }

    case DELETE_USERS_CREATION_DATE: {
      return {
        ...state,
        creationDate: state.creationDate.filter(date => !date[action.payload]),
      };
    }

    case CALCULATE_TOTAL_CHANGES: {
      const key = totalType[action.payload.type];
      const amount = action.payload.decrement ? action.payload.amount * -1 : action.payload.amount;

      return {
        ...state,
        [key]: state[key] + amount,
      };
    }

    case RESET_REPORTS: {
      return initialState;
    }

    default:
      return state;
  }
}
