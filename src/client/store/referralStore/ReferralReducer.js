import { uniqWith, isEqual } from 'lodash';
import {
  GET_USER_REFERRAL_DETAILS,
  GET_IS_USER_IN_BLACKLIST,
  GET_USER_REFERRAL_INFO,
  REFERRAL_GET_ADDITION_FIELDS,
  GET_USER_STATUS_CARDS,
  GET_MORE_USER_STATUS_CARDS,
  GET_ERROR_MORE_USER_STATUS_CARDS,
  REFERRAL_CONFIRM_RULES,
  REFERRAL_REJECT_RULES,
  GET_STATUS_SPONSORED_REWARDS,
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
  isStartChangeRules: false,
  referralStatus: '',
  referral: [],
  isChangedRuleSelection: false,
  isGetUsersCards: false,
  hasMoreCards: false,
  userCards: [],
  isLoadingMoreUserCards: false,
  isErrorLoadingMore: false,
  statusSponsoredHistory: [],
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
    case GET_USER_STATUS_CARDS.START: {
      return {
        ...state,
        isGetUsersCards: true,
      };
    }
    case GET_USER_STATUS_CARDS.SUCCESS: {
      return {
        ...state,
        hasMoreCards: action.payload.hasMore,
        userCards: action.payload.userCards,
        isGetUsersCards: false,
      };
    }
    case GET_MORE_USER_STATUS_CARDS.START: {
      return {
        ...state,
        isLoadingMoreUserCards: true,
        isErrorLoadingMore: false,
      };
    }
    case GET_MORE_USER_STATUS_CARDS.SUCCESS: {
      return {
        ...state,
        userCards: uniqWith(state.userCards.concat(action.payload.userCards), isEqual),
        isLoadingMoreUserCards: false,
        isErrorLoadingMore: false,
      };
    }
    case GET_MORE_USER_STATUS_CARDS.ERROR: {
      return {
        ...state,
        isErrorLoadingMore: true,
      };
    }
    case GET_ERROR_MORE_USER_STATUS_CARDS: {
      return {
        ...state,
        isErrorLoadingMore: true,
      };
    }
    case REFERRAL_CONFIRM_RULES.START: {
      return {
        ...state,
        isStartChangeRules: true,
      };
    }
    case REFERRAL_CONFIRM_RULES.SUCCESS: {
      return {
        ...state,
        isStartChangeRules: false,
      };
    }
    case REFERRAL_REJECT_RULES.START: {
      return {
        ...state,
        isStartChangeRules: true,
      };
    }
    case REFERRAL_REJECT_RULES.SUCCESS: {
      return {
        ...state,
        isStartChangeRules: false,
      };
    }
    case GET_STATUS_SPONSORED_REWARDS.SUCCESS: {
      return {
        ...state,
        statusSponsoredHistory: action.payload.histories,
      };
    }
    default:
      return state;
  }
};

export default ReferralReducer;
