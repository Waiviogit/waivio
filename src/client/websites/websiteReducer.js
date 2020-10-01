import { get } from 'lodash';
import * as websiteAction from './websiteActions';
import { getAvailableStatus } from './helper';

const initialState = {
  parentDomain: [],
  domainAvailableStatus: '',
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
    default: {
      return state;
    }
  }
}

export const getParentDomain = state => get(state, 'parentDomain', []);
export const getDomainAvailableStatus = state => get(state, 'domainAvailableStatus', []);
export const getWebsiteLoading = state => get(state, 'loading');
