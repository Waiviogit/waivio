import * as settingsTypes from './settingsActions';
import * as authTypes from '../authStore/authActions';
import { GET_USER_METADATA } from '../usersStore/usersActions';
import { rewardsValues } from '../../common/constants/rewards';
import { changeDate } from '../../client/settings/common/helpers';
import { defaultCurrency } from '../../client/websites/constants/currencyTypes';

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
  currency: defaultCurrency,
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
        return {
          ...action.payload.settings,
          loading: false,
          vipTicketsInfo: { ...state.vipTicketsInfo },
        };
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
