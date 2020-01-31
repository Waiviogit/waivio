import * as settingsTypes from './settingsActions';
import * as authTypes from '../auth/authActions';
import { GET_USER_METADATA } from '../user/usersActions';
import { rewardsValues } from '../../common/constants/rewards';

const initialState = {
  locale: 'auto',
  votingPower: false,
  votePercent: 10000,
  showNSFWPosts: false,
  nightmode: false,
  rewriteLinks: false,
  loading: false,
  upvoteSetting: false,
  exitPageSetting: true,
  rewardSetting: rewardsValues.half,
  postLocales: [],
};

const settings = (state = initialState, action) => {
  switch (action.type) {
    case authTypes.LOGIN_SUCCESS:
      if (action.meta && action.meta.refresh) return state;
      if (action.payload.userMetaData && action.payload.userMetaData.settings) {
        return { ...state, ...action.payload.userMetaData.settings };
      }
      return state;
    case GET_USER_METADATA.SUCCESS:
      if (action.payload && action.payload.settings) {
        return { ...action.payload.settings, loading: false };
      }
      return { ...state, loading: false };
    case GET_USER_METADATA.START:
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
    case GET_USER_METADATA.ERROR:
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
    case authTypes.LOGOUT:
      return initialState;
    default:
      return state;
  }
};

export default settings;

export const getIsLoading = state => state.loading;
export const getLocale = state => state.locale;
export const getReadLanguages = state => state.postLocales;
export const getVotingPower = state => state.votingPower;
export const getVotePercent = state => state.votePercent;
export const getShowNSFWPosts = state => state.showNSFWPosts;
export const getNightmode = state => state.nightmode;
export const getRewriteLinks = state => !!state.rewriteLinks;
export const getUpvoteSetting = state => state.upvoteSetting;
export const getExitPageSetting = state => state.exitPageSetting;
export const getRewardSetting = state => state.rewardSetting;
