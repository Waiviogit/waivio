import {
  SET_DATA_FOR_GLOBAL_REPORT,
  SET_DATA_FOR_SINGLE_REPORT,
  GET_REWARDS_GENERAL_COUNTS,
  GET_FOLLOWING_SPONSORS_REWARDS,
  GET_USER_REFERRAL_DETAILS,
  GET_IS_USER_IN_BLACKLIST,
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
  isStartLoadingReferralDetails: false,
  campaignServerPercent: null,
  indexAbsolutePercent: null,
  indexServerPercent: null,
  referralDuration: null,
  referralServerPercent: null,
  suspendedTimer: null,
  isUserInWaivioBlackList: false,
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
    case GET_USER_REFERRAL_DETAILS.START: {
      return {
        ...state,
        isStartLoadingReferralDetails: true,
      };
    }
    case GET_USER_REFERRAL_DETAILS.SUCCESS: {
      return {
        ...state,
        campaignServerPercent: action.payload.campaignServerPercent,
        indexAbsolutePercent: action.payload.indexAbsolutePercent,
        indexServerPercent: action.payload.indexServerPercent,
        referralDuration: action.payload.referralDuration,
        referralServerPercent: action.payload.referralServerPercent,
        suspendedTimer: action.payload.suspendedTimer,
        isStartLoadingReferralDetails: false,
      };
    }
    case GET_IS_USER_IN_BLACKLIST.SUCCESS: {
      console.log('action.payload: ', action.payload);
      return {
        ...state,
        isUserInWaivioBlackList: action.payload.isBlacklisted,
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
export const getHasMoreFollowingRewards = state => state.hasMoreFollowingRewards;
export const getIsLoading = state => state.loading;

// Referrals
export const getCampaignServerPercent = state => state.campaignServerPercent;
export const getIndexAbsolutePercent = state => state.indexAbsolutePercent;
export const getIndexServerPercent = state => state.indexServerPercent;
export const getReferralDuration = state => state.referralDuration;
export const getReferralServerPercent = state => state.referralServerPercent;
export const getSuspendedTimer = state => state.suspendedTimer;
export const getIsStartLoadingReferralDetails = state => state.isStartLoadingReferralDetails;
export const getIsUserInWaivioBlackList = state => state.isUserInWaivioBlackList;
