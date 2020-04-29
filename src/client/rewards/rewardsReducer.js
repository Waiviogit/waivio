import { SET_DATA_FOR_GLOBAL_REPORT, SET_DATA_FOR_SINGLE_REPORT } from './rewardsActions';

const initialState = {
  singleReportData: {},
  globalReportData: {},
};

const rewardsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_DATA_FOR_SINGLE_REPORT.ACTION:
      return {
        ...state,
        singleReportData: action.payload,
      };
    case SET_DATA_FOR_GLOBAL_REPORT.ACTION:
      return {
        ...state,
        globalReportData: action.payload,
      };
    default:
      return state;
  }
};

export default rewardsReducer;

// export const getIsMapModalOpen = state => state.isFullscreenMode;
export const getSingleReportData = state => state.singleReportData;
export const getGlobalReportData = state => state.globalReportData;
