import { get, uniqBy } from 'lodash';
import moment from 'moment';
import * as websiteAction from './websiteActions';
import { getAvailableStatus } from '../../websites/helper';

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
        wobjectsPoint: uniqBy(state.wobjectsPoint.concat(action.payload.wobjects), '_id'),
        wobjectsPointHasMore: action.payload.hasMore,
      };
    }

    case websiteAction.GET_WEBSITE_OBJECTS_WITH_COORDINATES.ERROR: {
      return {
        ...state,
        wobjectsPoint: [],
        wobjectsPointHasMore: false,
      };
    }

    case websiteAction.RESET_WEBSITE_OBJECTS_COORDINATES: {
      return {
        ...state,
        wobjectsPoint: [],
        wobjectsPointHasMore: false,
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
          ...action.payload,
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
          ...action.payload,
        },
        unmuteUsers,
      };
    }

    case websiteAction.SAVE_WEBSITE_CONFIGURATIONS.SUCCESS: {
      return {
        ...state,
        configurationWebsite: {
          ...action.payload,
        },
      };
    }

    case websiteAction.DELETE_WEBSITE_ERROR: {
      const websites = get(state, ['manage', 'websites'], []).map(website => ({
        ...website,
        checked: website.status === 'active',
        pending: [],
      }));

      return {
        ...state,
        manage: {
          ...state.manage,
          websites,
        },
      };
    }

    case websiteAction.SET_SHOW_RELOAD: {
      return {
        ...state,
        showReloadButton: action.payload,
      };
    }

    default: {
      return state;
    }
  }
}
