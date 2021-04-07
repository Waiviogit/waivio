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

export const getRewriteLinks = createSelector([settingsState], state => !!state.rewriteLinks);

export const getUpvoteSetting = createSelector([settingsState], state => state.upvoteSetting);

export const getExitPageSetting = createSelector([settingsState], state => state.exitPageSetting);

export const getRewardSetting = createSelector([settingsState], state => state.rewardSetting);

export const getHiveBeneficiaryAccount = createSelector(
  [settingsState],
  state => state.hiveBeneficiaryAccount,
);

export const isOpenLinkModal = createSelector([settingsState], state => state.openLinkModal);
