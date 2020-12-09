import { compact, concat, get, isEmpty, map, sortBy, remove, findIndex } from 'lodash';
import * as searchActions from './searchActions';
import formatter from '../helpers/steemitFormatter';
import { SEARCH_OBJECTS_LOADING_MORE } from './searchActions';

const initialState = {
  loading: true,
  searchError: false,
  searchResults: [],
  autoCompleteSearchResults: [],
  searchObjectsResults: [],
  usersForDiscoverPage: {
    result: [],
    loading: false,
  },
  beneficiariesUsers: [{ account: 'waivio', weight: 300 }],
  isStartSearchAutoComplete: false,
  isStartSearchUser: false,
  isStartSearchObject: false,
  isClearSearchObjects: false,
  websiteSearchType: 'All',
  websiteSearchResult: [],
  searchUsersResults: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case searchActions.SEARCH_ASK_STEEM.START:
      return {
        ...state,
        loading: true,
        searchError: false,
      };
    case searchActions.SEARCH_ASK_STEEM.SUCCESS: {
      const askSteemResults = get(action.payload, 0, []);
      const steemLookupResults = get(action.payload, 1, []);
      const parsedSteemLookupResults = map(steemLookupResults, accountDetails => ({
        ...accountDetails,
        reputation: formatter.reputation(accountDetails.reputation),
        name: accountDetails.account,
        type: 'user',
      }));
      const sortedSteemLookupResults = sortBy(parsedSteemLookupResults, 'reputation').reverse();
      const searchResults = compact(concat(sortedSteemLookupResults, askSteemResults));
      return {
        ...state,
        searchResults,
        loading: false,
      };
    }
    case searchActions.SEARCH_ASK_STEEM.ERROR:
      return {
        ...state,
        searchResults: [],
        loading: false,
        searchError: true,
      };
    case searchActions.AUTO_COMPLETE_SEARCH.START:
      return {
        ...state,
        isStartSearchAutoComplete: true,
      };
    case searchActions.AUTO_COMPLETE_SEARCH.SUCCESS: {
      const { result, search } = action.payload;
      const { followingUsersList } = action.meta;
      result.users.forEach(user => {
        // eslint-disable-next-line no-param-reassign
        user.isFollowing = followingUsersList.includes(user.account);
      });
      return {
        ...state,
        autoCompleteSearchResults: isEmpty(search) ? [] : result,
        isStartSearchAutoComplete: false,
      };
    }
    case searchActions.RESET_AUTO_COMPLETE_SEARCH: {
      return {
        ...state,
        autoCompleteSearchResults: [],
        searchObjectsResults: [],
        searchUsersResults: [],
        websiteSearchResult: [],
      };
    }
    case searchActions.SEARCH_OBJECTS.START:
      return {
        ...state,
        isStartSearchObject: true,
      };
    case searchActions.SEARCH_OBJECTS.SUCCESS: {
      const { result, search } = action.payload;
      return {
        ...state,
        searchObjectsResults: isEmpty(search) ? [] : result,
        isStartSearchObject: false,
      };
    }

    case searchActions.SEARCH_OBJECTS_LOADING_MORE.SUCCESS: {
      const { result, search } = action.payload;
      return {
        ...state,
        searchObjectsResults: [...state.searchObjectsResults, ...result],
        isStartSearchObject: false,
      };
    }
    case searchActions.SEARCH_OBJECTS.ERROR: {
      return initialState;
    }
    case searchActions.SEARCH_OBJECT_TYPES.SUCCESS: {
      const { result, search } = action.payload;
      return {
        ...state,
        searchObjectTypesResults: isEmpty(search) ? [] : result,
      };
    }

    case searchActions.SEARCH_USERS.START:
      return {
        ...state,
        isStartSearchUser: true,
      };

    case searchActions.SEARCH_USERS.SUCCESS: {
      const { result, search } = action.payload;

      return {
        ...state,
        searchUsersResults: isEmpty(search) ? [] : result,
        isStartSearchUser: false,
      };
    }

    case searchActions.SEARCH_USERS_LOADING_MORE.SUCCESS: {
      return {
        ...state,
        searchUsersResults: [...state.searchUsersResults, ...result],
        isStartSearchUser: false,
      };
    }

    case searchActions.SEARCH_USERS_FOR_DISCOVER_PAGE.START: {
      return {
        ...state,
        usersForDiscoverPage: {
          result: [],
          loading: true,
        },
      };
    }
    case searchActions.SEARCH_USERS_FOR_DISCOVER_PAGE.SUCCESS: {
      const { result } = action.payload;
      return {
        ...state,
        usersForDiscoverPage: {
          result,
          loading: false,
        },
      };
    }
    case searchActions.SEARCH_USERS_FOR_DISCOVER_PAGE.ERROR: {
      return {
        ...state,
        usersForDiscoverPage: {
          result: [...state.usersForDiscoverPage.result],
          loading: false,
        },
      };
    }

    case searchActions.RESET_SEARCH_USERS_FOR_DISCOVER_PAGE: {
      return {
        ...state,
        usersForDiscoverPage: [],
      };
    }
    case searchActions.CLEAR_SEARCH_OBJECTS_RESULT: {
      return {
        ...state,
        searchObjectsResults: [],
        isClearSearchObjects: true,
      };
    }
    case searchActions.RESET_TO_INITIAL_IS_CLEAR_SEARCH_OBJECTS: {
      return {
        ...state,
        isClearSearchObjects: false,
      };
    }
    case searchActions.UNFOLLOW_SEARCH_USER.SUCCESS: {
      const findExperts = state.usersForDiscoverPage.result.findIndex(
        user => user.account === action.meta.username,
      );

      state.usersForDiscoverPage.result.splice(findExperts, 1, {
        ...state.usersForDiscoverPage.result[findExperts],
        pending: false,
        youFollows: false,
      });

      return {
        ...state,
        usersForDiscoverPage: {
          ...state.usersForDiscoverPage,
          result: [...state.usersForDiscoverPage.result],
        },
      };
    }

    case searchActions.UNFOLLOW_SEARCH_USER.START: {
      const findExperts = state.usersForDiscoverPage.result.findIndex(
        user => user.account === action.meta.username,
      );

      state.usersForDiscoverPage.result.splice(findExperts, 1, {
        ...state.usersForDiscoverPage.result[findExperts],
        pending: true,
      });

      return {
        ...state,
        usersForDiscoverPage: {
          ...state.usersForDiscoverPage,
          result: [...state.usersForDiscoverPage.result],
        },
      };
    }

    case searchActions.UNFOLLOW_SEARCH_USER.ERROR: {
      const findExperts = state.usersForDiscoverPage.result.findIndex(
        user => user.account === action.meta.username,
      );

      state.usersForDiscoverPage.result.splice(findExperts, 1, {
        ...state.usersForDiscoverPage.result[findExperts],
        pending: false,
      });

      return {
        ...state,
        usersForDiscoverPage: {
          ...state.usersForDiscoverPage,
          result: [...state.usersForDiscoverPage.result],
        },
      };
    }

    case searchActions.FOLLOW_SEARCH_USER.START: {
      const findExperts = state.usersForDiscoverPage.result.findIndex(
        user => user.account === action.meta.username,
      );

      state.usersForDiscoverPage.result.splice(findExperts, 1, {
        ...state.usersForDiscoverPage.result[findExperts],
        pending: true,
      });

      return {
        ...state,
        usersForDiscoverPage: {
          ...state.usersForDiscoverPage,
          result: [...state.usersForDiscoverPage.result],
        },
      };
    }
    case searchActions.FOLLOW_SEARCH_USER.SUCCESS: {
      const findExperts = state.usersForDiscoverPage.result.findIndex(
        user => user.account === action.meta.username,
      );

      state.usersForDiscoverPage.result.splice(findExperts, 1, {
        ...state.usersForDiscoverPage.result[findExperts],
        youFollows: true,
        pending: false,
      });

      return {
        ...state,
        usersForDiscoverPage: {
          ...state.usersForDiscoverPage,
          result: [...state.usersForDiscoverPage.result],
        },
      };
    }

    case searchActions.FOLLOW_SEARCH_USER.ERROR: {
      const findExperts = state.usersForDiscoverPage.result.findIndex(
        user => user.account === action.meta.username,
      );

      state.usersForDiscoverPage.result.splice(findExperts, 1, {
        ...state.usersForDiscoverPage.result[findExperts],
        pending: false,
      });

      return {
        ...state,
        usersForDiscoverPage: {
          ...state.usersForDiscoverPage,
          result: [...state.usersForDiscoverPage.result],
        },
      };
    }

    case searchActions.SAVE_BENEFICIARIES_USERS.ACTION: {
      const key = action.payload;
      const newBeneficiariesUsers = [...state.beneficiariesUsers, { account: key, weight: 0 }];
      return {
        ...state,
        beneficiariesUsers: newBeneficiariesUsers,
      };
    }

    case searchActions.UPDATE_BENEFICIARIES_USERS.ACTION: {
      const { name, percent } = action.payload;
      const newBeneficiariesUsers = [...state.beneficiariesUsers];
      const benefIndex = findIndex(newBeneficiariesUsers, user => user.account === name);
      newBeneficiariesUsers[benefIndex].weight = percent * 100;
      return {
        ...state,
        beneficiariesUsers: newBeneficiariesUsers,
      };
    }

    case searchActions.REMOVE_BENEFICIARIES_USERS.ACTION: {
      const newBeneficiarieUsers = [...state.beneficiariesUsers];
      remove(newBeneficiarieUsers, user => user.account === action.payload);
      return {
        ...state,
        beneficiariesUsers: newBeneficiarieUsers,
      };
    }

    case searchActions.CLEAR_BENEFICIARIES_USERS.ACTION: {
      return {
        ...state,
        beneficiariesUsers: [{ account: 'waivio', weight: 300 }],
      };
    }

    case searchActions.WEBSITE_SEARCH_TYPE: {
      return {
        ...state,
        websiteSearchType: action.payload,
      };
    }

    case searchActions.SEARCH_OBJECTS_FOR_WEBSITE.SUCCESS: {
      return {
        ...state,
        websiteSearchResult: action.payload,
      };
    }
    default:
      return state;
  }
};

export const getSearchLoading = state => state.loading;
export const getSearchResults = state => state.searchResults;
export const getAutoCompleteSearchResults = state => state.autoCompleteSearchResults;
export const getSearchObjectsResults = state => state.searchObjectsResults;
export const getSearchUsersResults = state => state.searchUsersResults;
export const getSearchUsersResultsForDiscoverPage = state => state.usersForDiscoverPage;
export const searchObjectTypesResults = state => state.searchObjectTypesResults;
export const getBeneficiariesUsers = state => state.beneficiariesUsers;
export const getIsStartSearchAutoComplete = state => state.isStartSearchAutoComplete;
export const getIsStartSearchUser = state => state.isStartSearchUser;
export const getIsStartSearchObject = state => state.isStartSearchObject;
export const getIsClearSearchObjects = state => state.isClearSearchObjects;
export const getWebsiteSearchType = state => state.websiteSearchType;
export const getWebsiteSearchResult = state => state.websiteSearchResult;
