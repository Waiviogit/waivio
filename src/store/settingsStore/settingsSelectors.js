import { get } from 'lodash';
import { createSelector } from 'reselect';

// selector
export const settingsState = state => state.settings;

export const getIsSettingsLoading = createSelector([settingsState], state => state.loading);

export const getLocale = createSelector([settingsState], state => get(state, 'locale', 'en-US'));

export const getReadLanguages = createSelector([settingsState], state => state.postLocales);

export const getVotingPower = createSelector([settingsState], state => state.votingPower);

export const getVotePercent = createSelector([settingsState], state => state.votePercent);

export const getShowNSFWPosts = createSelector([settingsState], state => state.showNSFWPosts);

export const getNightmode = createSelector([settingsState], state => state.nightmode);

export const getCurrency = createSelector([settingsState], state => state.currency);

export const getRewriteLinks = createSelector([settingsState], state => !!state.rewriteLinks);

export const getUpvoteSetting = createSelector([settingsState], state => state.upvoteSetting);

export const getExitPageSetting = createSelector([settingsState], state => state.exitPageSetting);

export const getRewardSetting = createSelector([settingsState], state => state.rewardSetting);

export const getHiveBeneficiaryAccount = createSelector(
  [settingsState],
  state => state.hiveBeneficiaryAccount,
);

export const isOpenLinkModal = createSelector([settingsState], state => state.openLinkModal);

export const getActiveTickets = createSelector([settingsState], state =>
  get(state, 'vipTicketsInfo.activeTickets', []),
);

export const getConsumedTickets = createSelector([settingsState], state =>
  get(state, 'vipTicketsInfo.consumedTickets', []),
);

export const getShowMoreActiveTickets = createSelector([settingsState], state =>
  get(state, 'vipTicketsInfo.hasMoreActive', false),
);

export const getShowMoreConsumedTickets = createSelector([settingsState], state =>
  get(state, 'vipTicketsInfo.hasMoreConsumed', false),
);

export const getTicketsPrice = createSelector([settingsState], state =>
  get(state, 'vipTicketsInfo.price', 0),
);
