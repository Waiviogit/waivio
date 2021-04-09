import { createSelector } from 'reselect';

// selector
export const referralState = state => state.referral;

// reselect function
export const getCampaignServerPercent = createSelector(
  [referralState],
  state => state.campaignServerPercent,
);
export const getIndexAbsolutePercent = createSelector(
  [referralState],
  state => state.indexAbsolutePercent,
);
export const getIndexServerPercent = createSelector(
  [referralState],
  state => state.indexServerPercent,
);
export const getReferralDuration = createSelector([referralState], state => state.referralDuration);
export const getReferralServerPercent = createSelector(
  [referralState],
  state => state.referralServerPercent,
);
export const getSuspendedTimer = createSelector([referralState], state => state.suspendedTimer);
export const getIsStartLoadingReferralDetails = createSelector(
  [referralState],
  state => state.isStartLoadingReferralDetails,
);
export const getIsUserInWaivioBlackList = createSelector(
  [referralState],
  state => state.isUserInWaivioBlackList,
);
export const getReferralStatus = createSelector([referralState], state => state.referralStatus);
export const getReferralList = createSelector([referralState], state => state.referral);
export const getIsChangedRuleSelection = createSelector(
  [referralState],
  state => state.isChangedRuleSelection,
);
export const getIsUsersCards = createSelector([referralState], state => state.isGetUsersCards);
export const getIsHasMoreCards = createSelector([referralState], state => state.hasMoreCards);
export const getCurrentUserCards = createSelector([referralState], state => state.userCards);
export const getIsErrorLoadingUserCards = createSelector(
  [referralState],
  state => state.isErrorLoadingMore,
);
export const getIsLoadingMoreUserCards = createSelector(
  [referralState],
  state => state.isLoadingMoreUserCards,
);
export const getIsStartChangeRules = createSelector(
  [referralState],
  state => state.isStartChangeRules,
);
export const getIsStartGetReferralInfo = createSelector(
  [referralState],
  state => state.isStartGetReferralInfo,
);
export const getStatusSponsoredHistory = createSelector(
  [referralState],
  state => state.statusSponsoredHistory,
);
