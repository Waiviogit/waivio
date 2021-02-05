import { get, isEqual, uniqWith } from 'lodash';
import moment from 'moment';
import * as websiteAction from './websiteActions';
import { getAvailableStatus } from './helper';

const initialState = {
  parentDomain: [],
  domainAvailableStatus: '',
  manage: {},
  reports: {},
  ownWebsites: [],
  configurationWebsite: {},
  administrators: [],
  moderators: [],
  authorities: [],
  tags: {},
  loading: false,
  loadingWebsite: false,
  settings: {},
  areas: [],
  isLoadingAreas: false,
  restrictions: null,
  muteLoading: false,
  unmuteUsers: [],
  wobjectsPoint: [],
  wobjectsPointHasMore: false,
};

export default function websiteReducer(state = initialState, action) {
  switch (action.type) {
    case websiteAction.GET_PARENT_DOMAIN.START: {
      return {
        ...state,
        loading: true,
      };
    }
    case websiteAction.GET_PARENT_DOMAIN.SUCCESS: {
      const mappedParentDomainList = action.payload.reduce(
        (acc, domain) => ({ ...acc, [domain.domain]: get(domain, '_id') }),
        {},
      );

      return {
        ...state,
        parentDomain: mappedParentDomainList,
        loading: false,
      };
    }
    case websiteAction.CHECK_AVAILABLE_DOMAIN.SUCCESS:
      return {
        ...state,
        domainAvailableStatus: getAvailableStatus(action.payload),
      };
    case websiteAction.CREATE_NEW_WEBSITE.START: {
      return {
        ...state,
        loadingWebsite: true,
      };
    }
    case websiteAction.CREATE_NEW_WEBSITE.SUCCESS: {
      return {
        ...state,
        loadingWebsite: false,
      };
    }
    case websiteAction.GET_INFO_FOR_MANAGE_PAGE.SUCCESS: {
      const websites = get(action.payload, 'websites', []).map(website => ({
        ...website,
        checked: website.status === 'active',
        pending: [],
      }));

      return {
        ...state,
        manage: {
          ...action.payload,
          websites,
        },
        loading: false,
      };
    }
    case websiteAction.GET_INFO_FOR_MANAGE_PAGE.START: {
      return {
        ...state,
        loading: true,
      };
    }
    case websiteAction.CHANGE_STATUS_WEBSITE: {
      const websites = [...state.manage.websites];
      const changedIndex = websites.findIndex(web => web.host === action.id);

      websites.splice(changedIndex, 1, {
        ...websites[changedIndex],
        pending: [...websites[changedIndex].pending, 'checkbox'],
      });

      return {
        ...state,
        manage: {
          ...state.manage,
          websites,
        },
      };
    }

    case websiteAction.DELETE_WEBSITE: {
      const websites = [...state.manage.websites];
      const changedIndex = websites.findIndex(web => web.host === action.id);

      websites.splice(changedIndex, 1, {
        ...websites[changedIndex],
        pending: [...websites[changedIndex].pending, 'delete'],
      });

      return {
        ...state,
        manage: {
          ...state.manage,
          websites,
        },
      };
    }

    case websiteAction.GET_REPORTS_PAGE.SUCCESS: {
      return {
        ...state,
        reports: {
          ...action.payload,
          payments: action.payload.payments.map(payment => ({
            ...payment,
            createdAt: moment(payment.createdAt).format('DD-MMM-YYYY'),
          })),
        },
      };
    }

    case websiteAction.GET_OWN_WEBSITE.SUCCESS: {
      return {
        ...state,
        ownWebsites: action.payload,
      };
    }

    case websiteAction.GET_WEBSITE_CONFIGURATIONS.START: {
      return {
        ...state,
        loading: true,
      };
    }

    case websiteAction.GET_WEBSITE_CONFIGURATIONS.SUCCESS: {
      return {
        ...state,
        configurationWebsite: action.payload,
        loading: false,
      };
    }

    case websiteAction.GET_WEBSITE_MODERATORS.SUCCESS: {
      return {
        ...state,
        moderators: action.payload,
      };
    }

    case websiteAction.GET_WEBSITE_AUTHORITIES.SUCCESS: {
      return {
        ...state,
        authorities: action.payload,
      };
    }

    case websiteAction.GET_WEBSITE_ADMINISTRATORS.SUCCESS: {
      return {
        ...state,
        administrators: action.payload,
      };
    }

    case websiteAction.DELETE_WEBSITE_ADMINISTRATOR.START: {
      const administrators = [...state.administrators];
      const findUser = administrators.findIndex(admin => admin.name === action.payload);

      administrators.splice(findUser, 1, {
        ...administrators[findUser],
        loading: true,
      });

      return {
        ...state,
        administrators,
      };
    }
    case websiteAction.DELETE_WEBSITE_ADMINISTRATOR.SUCCESS: {
      return {
        ...state,
        administrators: state.administrators.filter(admin => !action.payload.includes(admin.name)),
      };
    }

    case websiteAction.ADD_WEBSITE_ADMINISTRATOR.START: {
      return {
        ...state,
        loading: true,
      };
    }
    case websiteAction.ADD_WEBSITE_ADMINISTRATOR.SUCCESS: {
      return {
        ...state,
        administrators: action.payload,
        loading: false,
      };
    }

    case websiteAction.DELETE_WEBSITE_MODERATORS.START: {
      const moderators = [...state.moderators];
      const findUser = moderators.findIndex(admin => admin.name === action.payload);

      moderators.splice(findUser, 1, {
        ...moderators[findUser],
        loading: true,
      });

      return {
        ...state,
        moderators,
      };
    }
    case websiteAction.DELETE_WEBSITE_MODERATORS.SUCCESS: {
      return {
        ...state,
        moderators: state.moderators.filter(admin => !action.payload.includes(admin.name)),
      };
    }

    case websiteAction.ADD_WEBSITE_MODERATORS.START: {
      return {
        ...state,
        loading: true,
      };
    }
    case websiteAction.ADD_WEBSITE_MODERATORS.SUCCESS: {
      return {
        ...state,
        moderators: action.payload,
        loading: false,
      };
    }

    case websiteAction.DELETE_WEBSITE_AUTHORITIES.START: {
      const authorities = [...state.authorities];
      const findUser = authorities.findIndex(admin => admin.name === action.payload);

      authorities.splice(findUser, 1, {
        ...authorities[findUser],
        loading: true,
      });

      return {
        ...state,
        authorities,
      };
    }
    case websiteAction.DELETE_WEBSITE_AUTHORITIES.SUCCESS: {
      return {
        ...state,
        authorities: state.authorities.filter(admin => !action.payload.includes(admin.name)),
      };
    }

    case websiteAction.ADD_WEBSITE_AUTHORITIES.START: {
      return {
        ...state,
        loading: true,
      };
    }

    case websiteAction.ADD_WEBSITE_AUTHORITIES.SUCCESS: {
      return {
        ...state,
        authorities: action.payload,
        loading: false,
      };
    }

    case websiteAction.GET_WEBSITE_TAGS.SUCCESS: {
      return {
        ...state,
        tags: action.payload,
        loading: false,
      };
    }

    case websiteAction.GET_WEBSITE_SETTINGS.SUCCESS: {
      return {
        ...state,
        settings: action.payload,
      };
    }

    case websiteAction.SET_WEBSITE_OBJECTS_COORDINATES.START: {
      return {
        ...state,
        isLoadingAreas: true,
      };
    }

    case websiteAction.SET_WEBSITE_OBJECTS_COORDINATES.SUCCESS: {
      return {
        ...state,
        isLoadingAreas: false,
        areas: action.payload,
      };
    }

    case websiteAction.GET_WEBSITE_OBJECTS_WITH_COORDINATES.SUCCESS: {
      if (state.wobjectsPoint.length > 150) {
        state.wobjectsPoint.splice(0, 50);
      }
      return {
        ...state,
        wobjectsPoint: uniqWith(state.wobjectsPoint.concat(action.payload.wobjects), isEqual),
        wobjectsPointHasMore: action.payload.hasMore,
      };
    }

    case websiteAction.GET_WEBSITE_RESTRICTIONS.SUCCESS: {
      return {
        ...state,
        restrictions: action.payload,
      };
    }

    case websiteAction.MUTE_USER.START: {
      return {
        ...state,
        muteLoading: true,
      };
    }

    case websiteAction.MUTE_USER.SUCCESS: {
      return {
        ...state,
        restrictions: {
          ...state.restrictions,
          mutedUsers: action.payload.mutedUsers,
          mutedCount: action.payload.mutedCount,
        },
        muteLoading: false,
      };
    }

    case websiteAction.UNMUTE_USER.START: {
      const unmuteUsers = [...state.unmuteUsers, ...action.meta];

      return {
        ...state,
        unmuteUsers,
      };
    }

    case websiteAction.UNMUTE_USER.SUCCESS: {
      const unmuteUsers = state.unmuteUsers.filter(user => user.name === action.meta);

      return {
        ...state,
        restrictions: {
          ...state.restrictions,
          mutedUsers: action.payload.mutedUsers,
          mutedCount: action.payload.mutedCount,
        },
        unmuteUsers,
      };
    }

    default: {
      return state;
    }
  }
}

export const getParentDomain = state => get(state, 'parentDomain', []);
export const getDomainAvailableStatus = state => get(state, 'domainAvailableStatus', []);
export const getWebsiteLoading = state => get(state, 'loading');
export const getCreateWebsiteLoading = state => get(state, 'loadingWebsite');
export const getManage = state => get(state, 'manage');
export const getReports = state => get(state, 'reports');
export const getOwnWebsites = state => get(state, 'ownWebsites', []);
export const getConfiguration = state => get(state, 'configurationWebsite', {});
export const getAdministrators = state => get(state, 'administrators', {});
export const getModerators = state => get(state, 'moderators', {});
export const getAuthorities = state => get(state, 'authorities', {});
export const getTagsSite = state => get(state, 'tags', {});
export const getSettingsSite = state => get(state, 'settings', {});
export const getRestrictions = state => get(state, 'restrictions', {});
export const getMuteLoading = state => get(state, 'muteLoading', {});
export const getUnmutedUsers = state => get(state, 'unmuteUsers', []);
export const getIsLoadingAreas = state => state.isLoadingAreas;
export const getWobjectsPoint = state => state.wobjectsPoint;
export const getIsUsersAreas = state => state.areas;
