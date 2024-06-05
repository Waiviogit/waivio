import {
  CALCULATE_TOTAL_CHANGES,
  DELETE_USERS_CREATION_DATE,
  EXCLUDE_TRANSFER,
  GENERATE_REPORTS,
  GET_HISTORY_REPORTS,
  GET_IN_PROGRESS_REPORTS,
  GET_MORE_TRANSACTIONS_FOR_TABLE,
  GET_TRANSACTIONS_FOR_TABLE,
  GET_USERS_CREATION_DATE,
  PAUSE_IN_PROGRESS_REPORTS,
  RESET_REPORTS,
  RESUME_IN_PROGRESS_REPORTS,
  STOP_IN_PROGRESS_REPORTS,
} from './advancedActions';
import { totalType } from '../../common/constants/advansedReports';

const initialState = {
  deposits: 0,
  withdrawals: 0,
  isLoading: false,
  isLoadingMore: false,
  wallet: [],
  loadingAllData: false,
  creationDate: [],
  activeGenerate: [],
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
        reportCurrency: data.reportCurrency,
        reportAccounts: data.reportAccounts,
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
        [key]: Number(state[key]) + amount,
      };
    }

    case GENERATE_REPORTS: {
      return {
        ...state,
        activeGenerate: [...state.activeGenerate, action.report],
      };
    }

    case GET_IN_PROGRESS_REPORTS.SUCCESS: {
      return {
        ...state,
        activeGenerate: action.payload,
      };
    }

    case GET_HISTORY_REPORTS.SUCCESS: {
      return {
        ...state,
        historyReports: action.payload,
      };
    }

    case EXCLUDE_TRANSFER.START: {
      const transferList = [...state.wallet];
      const transferIndex = transferList.findIndex(
        transaction =>
          transaction?.[action?.meta?.key] === action.meta.id || transaction._id === action.meta.id,
      );

      const transfer = transferList[transferIndex];

      if (transfer) {
        transferList.splice(transferIndex, 1, {
          ...transfer,
          checked: !transfer.checked,
        });
      }

      return {
        ...state,
        wallet: transferList,
      };
    }

    case PAUSE_IN_PROGRESS_REPORTS.SUCCESS:
    case RESUME_IN_PROGRESS_REPORTS.SUCCESS: {
      const transferList = [...state.activeGenerate];
      const transferIndex = transferList.findIndex(
        transaction => transaction?.reportId === action.payload.reportId,
      );
      const transfer = transferList[transferIndex];

      if (transfer) {
        transferList.splice(transferIndex, 1, action.payload);
      }

      return {
        ...state,
        activeGenerate: transferList,
      };
    }
    case STOP_IN_PROGRESS_REPORTS.SUCCESS: {
      const transferList = [...state.activeGenerate];
      const transferIndex = transferList.findIndex(
        transaction => transaction?.reportId === action.payload.reportId,
      );
      const transfer = transferList[transferIndex];

      if (transfer) {
        transferList.splice(transferIndex, 1);
      }

      return {
        ...state,
        activeGenerate: transferList,
        historyReports: [action.payload, ...state.historyReports],
      };
    }

    case RESET_REPORTS: {
      return initialState;
    }

    default:
      return state;
  }
}
