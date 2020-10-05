import { GET_USER_REFERRAL_DETAILS, GET_IS_USER_IN_BLACKLIST } from './ReferralActions';

const initialState = {
  isStartLoadingReferralDetails: false,
  campaignServerPercent: null,
  indexAbsolutePercent: null,
  indexServerPercent: null,
  referralDuration: null,
  referralServerPercent: null,
  suspendedTimer: null,
  isUserInWaivioBlackList: false,
};

const ReferralReducer = (state = initialState, action) => {
  switch (action.type) {
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
