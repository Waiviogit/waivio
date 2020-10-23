import { get } from 'lodash';
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
  loading: false,
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
        loading: true,
      };
    }
    case websiteAction.CREATE_NEW_WEBSITE.SUCCESS: {
      return {
        ...state,
        loading: false,
      };
    }
    case websiteAction.GET_INFO_FOR_MANAGE_PAGE.SUCCESS: {
      const websites = get(action.payload, 'websites').map(website => ({
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

    case websiteAction.GET_WEBSITE_CONFIGURATIONS.SUCCESS: {
      return {
        ...state,
        configurationWebsite: action.payload,
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
export const getManage = state => get(state, 'manage');
export const getReports = state => get(state, 'reports');
export const getOwnWebsites = state => get(state, 'ownWebsites', []);
export const getConfiguration = state => get(state, 'configurationWebsite', {})
