import {
  SET_DATA_FOR_GLOBAL_REPORT,
  SET_DATA_FOR_SINGLE_REPORT,
  GET_REWARDS_GENERAL_COUNTS,
} from './rewardsActions';

const initialState = {
  singleReportData: {},
  globalReportData: {},
  tabType: '',
  hasReceivables: '',
  countTookPartCampaigns: 0,
  createdCampaignsCount: 0,
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
    case GET_REWARDS_GENERAL_COUNTS.SUCCESS: {
      return {
        ...state,
        tabType: action.payload.tabType,
        hasReceivables: action.payload.has_receivable,
        countTookPartCampaigns: action.payload.count_took_part_campaigns,
        createdCampaignsCount: action.payload.count_campaigns,
      };
    }
    default:
      return state;
  }
};

export default rewardsReducer;

// export const getIsMapModalOpen = state => state.isFullscreenMode;
export const getSingleReportData = state => state.singleReportData;
export const getGlobalReportData = state => state.globalReportData;
export const getTabType = state => state.tabType;
export const getHasReceivables = state => state.hasReceivables;
export const getCountTookPartCampaigns = state => state.countTookPartCampaigns;
export const getCreatedCampaignsCount = state => state.createdCampaignsCount;
