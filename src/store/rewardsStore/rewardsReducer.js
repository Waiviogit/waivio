import {
  SET_DATA_FOR_GLOBAL_REPORT,
  SET_DATA_FOR_SINGLE_REPORT,
  GET_FOLLOWING_SPONSORS_REWARDS,
  CLEAR_FOLLOWING_SPONSORS_REWARDS,
  GET_FRAUD_SUSPICION,
  GET_REWARDS_HISTORY,
  GET_MORE_REWARDS_HISTORY,
  SET_TOGGLE_FLAG,
  REMOVE_TOGGLE_FLAG,
  GET_MATCH_BOTS,
  CLEAR_MATCH_BOTS,
} from './rewardsActions';

const initialState = {
  singleReportData: {},
  globalReportData: {},
  tabType: '',
  hasReceivables: '',
  countTookPartCampaigns: 0,
  createdCampaignsCount: 0,
  reservedComments: {},
  followingRewards: [],
  hasMoreFollowingRewards: false,
  loading: false,
  fraudSuspicionData: [],
  hasMoreFraudSuspicionData: false,
  isLoadingRewardsHistory: false,
  campaignNames: [],
  historyCampaigns: [],
  historySponsors: [],
  hasMoreHistory: false,
  isOpenWriteReviewModal: false,
  expiredPayment: false,
  matchBots: [],
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
    case GET_FOLLOWING_SPONSORS_REWARDS.START: {
      return {
        ...state,
        loading: true,
      };
    }
    case CLEAR_FOLLOWING_SPONSORS_REWARDS.ACTION: {
      return {
        ...state,
        followingRewards: [],
      };
    }
    case GET_FRAUD_SUSPICION.START: {
      return {
        ...state,
        loading: true,
      };
    }
    case GET_REWARDS_HISTORY.START: {
      return {
        ...state,
        isLoadingRewardsHistory: true,
      };
    }
    case GET_REWARDS_HISTORY.ERROR: {
      return {
        ...state,
        isLoadingRewardsHistory: false,
      };
    }
    case GET_MORE_REWARDS_HISTORY.START: {
      return {
        ...state,
        isLoadingRewardsHistory: true,
      };
    }
    case GET_MORE_REWARDS_HISTORY.ERROR: {
      return {
        ...state,
        isLoadingRewardsHistory: false,
      };
    }
    case SET_TOGGLE_FLAG: {
      return {
        ...state,
        isOpenWriteReviewModal: true,
      };
    }
    case REMOVE_TOGGLE_FLAG: {
      return {
        ...state,
        isOpenWriteReviewModal: false,
      };
    }
    case GET_MATCH_BOTS.SUCCESS: {
      return {
        ...state,
        matchBots: action.payload,
      };
    }
    case CLEAR_MATCH_BOTS:
    case GET_MATCH_BOTS.ERROR: {
      return {
        ...state,
        matchBots: [],
      };
    }
    default:
      return state;
  }
};

export default rewardsReducer;
