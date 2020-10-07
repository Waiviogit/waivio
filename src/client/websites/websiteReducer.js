import { get } from 'lodash';
import * as websiteAction from './websiteActions';
import { getAvailableStatus } from './helper';

const initialState = {
  parentDomain: [],
  domainAvailableStatus: '',
  manage: {},
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

    case websiteAction.ACTIVATE_WEBSITE.START: {
      const websites = [...state.manage.websites];
      const changedIndex = websites.findIndex(web => web.host === action.id);

      websites.splice(changedIndex, 1, { ...websites[changedIndex], checked: true });

      return {
        ...state,
        manage: {
          ...state.manage,
          websites,
        },
      };
    }

    case websiteAction.SUSPEND_WEBSITE.START: {
      const websites = [...state.manage.websites];
      const changedIndex = websites.findIndex(web => web.host === action.id);

      websites.splice(changedIndex, 1, { ...websites[changedIndex], checked: false });

      return {
        ...state,
        manage: {
          ...state.manage,
          websites,
        },
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
