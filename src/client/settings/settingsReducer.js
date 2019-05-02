import * as settingsTypes from './settingsActions';
import * as authTypes from '../auth/authActions';
import { rewardsValues } from '../../common/constants/rewards';

const initialState = {
  locale: 'auto',
  readLanguages: [],
  votingPower: 'auto',
  votePercent: 10000,
  showNSFWPosts: false,
  nightmode: false,
  rewriteLinks: false,
  loading: false,
  upvoteSetting: false,
  exitPageSetting: true,
  rewardSetting: rewardsValues.half,
};

const settings = (state = initialState, action) => {
  switch (action.type) {
    case authTypes.LOGIN_SUCCESS:
    case authTypes.RELOAD_SUCCESS:
      if (action.meta && action.meta.refresh) return state;
      if (action.payload.user_metadata && action.payload.user_metadata.settings) {
        const {
          locale,
          readLanguages,
          votingPower,
          votePercent,
          showNSFWPosts,
          nightmode,
          rewriteLinks,
          upvoteSetting,
          exitPageSetting,
          rewardSetting,
        } = action.payload.user_metadata.settings;
        return {
          ...state,
          locale: locale || initialState.locale,
          readLanguages: readLanguages || initialState.readLanguages,
          votingPower: votingPower || initialState.votingPower,
          votePercent: votePercent || initialState.votePercent,
          showNSFWPosts: showNSFWPosts || initialState.showNSFWPosts,
          nightmode: nightmode || initialState.nightmode,
          rewriteLinks:
            typeof rewriteLinks === 'boolean' ? rewriteLinks : initialState.rewriteLinks,
          upvoteSetting:
            typeof upvoteSetting === 'boolean' ? upvoteSetting : initialState.upvoteSetting,
          exitPageSetting:
            typeof exitPageSetting === 'boolean' ? exitPageSetting : initialState.exitPageSetting,
          rewardSetting: rewardSetting || initialState.rewardSetting,
        };
      }
      return state;
    case settingsTypes.SAVE_SETTINGS_START:
      return {
        ...state,
        loading: true,
      };
    case settingsTypes.SAVE_SETTINGS_SUCCESS:
      return {
        ...state,
        ...action.payload,
        loading: false,
      };
    case settingsTypes.SAVE_SETTINGS_ERROR:
      return {
        ...state,
        loading: false,
      };
    case settingsTypes.SET_LOCALE:
      return {
        ...state,
        locale: action.payload,
      };
    default:
      return state;
  }
};

export default settings;

export const getIsLoading = state => state.loading;
export const getLocale = state => state.locale;
export const getReadLanguages = state => state.readLanguages;
export const getVotingPower = state => state.votingPower;
export const getVotePercent = state => state.votePercent;
export const getShowNSFWPosts = state => state.showNSFWPosts;
export const getNightmode = state => state.nightmode;
export const getRewriteLinks = state => !!state.rewriteLinks;
export const getUpvoteSetting = state => state.upvoteSetting;
export const getExitPageSetting = state => state.exitPageSetting;
export const getRewardSetting = state => state.rewardSetting;
