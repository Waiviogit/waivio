import {
  GET_USER_REFERRAL_DETAILS,
  GET_IS_USER_IN_BLACKLIST,
  GET_USER_REFERRAL_INFO,
  REFERRAL_GET_ADDITION_FIELDS,
} from './ReferralActions';

const initialState = {
  isStartLoadingReferralDetails: false,
  campaignServerPercent: null,
  indexAbsolutePercent: null,
  indexServerPercent: null,
  referralDuration: null,
  referralServerPercent: null,
  suspendedTimer: null,
  isUserInWaivioBlackList: false,
  isStartGetReferralInfo: false,
  referralStatus: '',
  referral: [],
  isChangedRuleSelection: false,
};

const ReferralReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_USER_REFERRAL_INFO.START: {
      return {
        ...state,
        isStartGetReferralInfo: true,
      };
    }
    case GET_USER_REFERRAL_INFO.SUCCESS: {
      return {
        ...state,
        isStartGetReferralInfo: false,
        referralStatus: action.payload.referralStatus,
        referral: action.payload.referral,
      };
    }
    case GET_USER_REFERRAL_INFO.ERROR: {
      return {
        ...state,
        isStartGetReferralInfo: false,
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
      return {
        ...state,
        isUserInWaivioBlackList: action.payload.isBlacklisted,
      };
    }
    case REFERRAL_GET_ADDITION_FIELDS.START: {
      return {
        ...state,
        isChangedRuleSelection: true,
      };
    }
    case REFERRAL_GET_ADDITION_FIELDS.SUCCESS: {
      return {
        ...state,
        referralStatus: action.payload.referralStatus,
        referralList: action.payload.referral,
        isChangedRuleSelection: false,
      };
    }
    default:
      return state;
  }
};

export default ReferralReducer;

export const getCampaignServerPercent = state => state.campaignServerPercent;
export const getIndexAbsolutePercent = state => state.indexAbsolutePercent;
export const getIndexServerPercent = state => state.indexServerPercent;
export const getReferralDuration = state => state.referralDuration;
export const getReferralServerPercent = state => state.referralServerPercent;
export const getSuspendedTimer = state => state.suspendedTimer;
export const getIsStartLoadingReferralDetails = state => state.isStartLoadingReferralDetails;
export const getIsUserInWaivioBlackList = state => state.isUserInWaivioBlackList;
export const getReferralStatus = state => state.referralStatus;
export const getReferralList = state => state.referral;
export const getIsChangedRuleSelection = state => state.isChangedRuleSelection;
