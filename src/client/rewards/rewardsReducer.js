import {
  SET_DATA_FOR_GLOBAL_REPORT,
  SET_DATA_FOR_SINGLE_REPORT,
  GET_REWARDS_GENERAL_COUNTS,
  GET_FOLLOWING_SPONSORS_REWARDS,
  CLEAR_FOLLOWING_SPONSORS_REWARDS,
  GET_FRAUD_SUSPICION,
  GET_PROPOSITIONS_LIST_CONTAINER,
} from './rewardsActions';
import { GET_RESERVED_COMMENTS_SUCCESS } from '../comments/commentsActions';

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
  campaigns: {},
  isLoadingPropositions: false,
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
    case GET_RESERVED_COMMENTS_SUCCESS: {
      return {
        ...state,
        reservedComments: action.payload.content,
      };
    }
    case GET_FOLLOWING_SPONSORS_REWARDS.START: {
      return {
        ...state,
        loading: true,
      };
    }
    case GET_FOLLOWING_SPONSORS_REWARDS.SUCCESS: {
      const { campaigns, hasMore } = action.payload;
      return {
        ...state,
        loading: false,
        followingRewards: state.followingRewards.concat(campaigns),
        hasMoreFollowingRewards: hasMore,
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
    case GET_FRAUD_SUSPICION.SUCCESS: {
      const { campaigns, hasMore } = action.payload;
      return {
        ...state,
        loading: false,
        fraudSuspicionData: hasMore ? state.fraudSuspicionData.concat(campaigns) : campaigns,
        hasMoreFraudSuspicionData: hasMore,
      };
    }
    case GET_PROPOSITIONS_LIST_CONTAINER.START: {
      return {
        ...state,
        isLoadingPropositions: true,
      };
    }
    case GET_PROPOSITIONS_LIST_CONTAINER.SUCCESS: {
      return {
        ...state,
        isLoadingPropositions: false,
        campaigns: action.payload.campaigns,
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
export const getCommentsFromReserved = state => state.reservedComments;
export const getSponsorsRewards = state => state.followingRewards;
export const getFraudSuspicionDataState = state => state.fraudSuspicionData;
export const getHasMoreFollowingRewards = state => state.hasMoreFollowingRewards;
export const getHasMoreFraudSuspicionData = state => state.hasMoreFraudSuspicionData;
export const getIsLoading = state => state.loading;
export const getPropositionCampaign = state => state.campaigns;
export const getIsLoadingPropositions = state => state.isLoadingPropositions;
