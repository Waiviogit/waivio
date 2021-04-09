import { get } from 'lodash';
import * as settingsTypes from './settingsActions';
import * as authTypes from '../store/authStore/authActions';
import { GET_USER_METADATA } from '../user/usersActions';
import { rewardsValues } from '../../common/constants/rewards';
import { changeDate } from './common/helpers';

const initialState = {
  locale: 'en-US',
  votingPower: true,
  votePercent: 10000,
  showNSFWPosts: false,
  nightmode: false,
  rewriteLinks: false,
  loading: false,
  upvoteSetting: false,
  exitPageSetting: true,
  rewardSetting: rewardsValues.half,
  postLocales: [],
  newUser: false,
  openLinkModal: false,
  vipTicketsInfo: {},
};

const settings = (state = initialState, action) => {
  switch (action.type) {
    case authTypes.LOGIN_SUCCESS:
      if (action.meta && action.meta.refresh) return state;
      if (action.payload.userMetaData && action.payload.userMetaData.settings) {
        return {
          ...state,
          ...action.payload.userMetaData.settings,
          newUser: action.payload.userMetaData.new_user,
        };
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

    case settingsTypes.SET_USER_STATUS.SUCCESS:
      return {
        ...state,
        newUser: false,
      };

    case settingsTypes.SET_USER_STATUS.ERROR:
      return state;

    case settingsTypes.OPEN_LINK_MODAL:
      return {
        ...state,
        openLinkModal: action.payload,
      };

    case settingsTypes.GET_VIP_TICKETS_INFO.SUCCESS:
      return {
        ...state,
        vipTicketsInfo: {
          ...action.payload,
          activeTickets: changeDate(action.payload.activeTickets),
          consumedTickets: changeDate(action.payload.consumedTickets),
        },
      };

    case settingsTypes.GET_ACTIVE_VIP_TICKETS_INFO_MORE.SUCCESS:
      return {
        ...state,
        vipTicketsInfo: {
          ...state.vipTicketsInfo,
          activeTickets: [
            ...state.vipTicketsInfo.activeTickets,
            ...changeDate(action.payload.activeTickets),
          ],
          hasMoreActive: action.payload.hasMoreActive,
        },
      };

    case settingsTypes.GET_CONSUMED_VIP_TICKETS_INFO_MORE.SUCCESS:
      return {
        ...state,
        vipTicketsInfo: {
          ...state.vipTicketsInfo,
          consumedTickets: [
            ...state.vipTicketsInfo.consumedTickets,
            ...changeDate(action.payload.consumedTickets),
          ],
          hasMoreConsumed: action.payload.hasMoreConsumed,
        },
      };

    case authTypes.LOGOUT:
      return initialState;

    default:
      return state;
  }
};

export default settings;

export const getIsLoading = state => state.loading;
export const getLocale = state => get(state, 'locale', 'en-US');
export const getReadLanguages = state => state.postLocales;
export const getVotingPower = state => state.votingPower;
export const getVotePercent = state => state.votePercent;
export const getShowNSFWPosts = state => state.showNSFWPosts;
export const getNightmode = state => state.nightmode;
export const getRewriteLinks = state => !!state.rewriteLinks;
export const getUpvoteSetting = state => state.upvoteSetting;
export const getExitPageSetting = state => state.exitPageSetting;
export const getRewardSetting = state => state.rewardSetting;
export const getHiveBeneficiaryAccount = state => state.hiveBeneficiaryAccount;
export const isOpenLinkModal = state => state.openLinkModal;
export const getActiveTickets = state => get(state, 'vipTicketsInfo.activeTickets', []);
export const getConsumedTickets = state => get(state, 'vipTicketsInfo.consumedTickets', []);
export const getShowMoreActiveTickets = state => get(state, 'vipTicketsInfo.hasMoreActive', false);
export const getShowMoreConsumedTickets = state =>
  get(state, 'vipTicketsInfo.hasMoreConsumed', false);
export const getTicketsPrice = state => get(state, 'vipTicketsInfo.price', []);
