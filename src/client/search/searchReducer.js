import { compact, concat, get, isEmpty, map, sortBy } from 'lodash';
import * as searchActions from './searchActions';
import formatter from '../helpers/steemitFormatter';
import { getClientWObj } from '../adapters';

const initialState = {
  loading: true,
  searchError: false,
  searchResults: [],
  autoCompleteSearchResults: [],
  searchObjectsResults: [],
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
      };
    }
    case searchActions.RESET_AUTO_COMPLETE_SEARCH: {
      return {
        ...state,
        autoCompleteSearchResults: [],
        searchObjectsResults: [],
        searchUsersResults: [],
      };
    }
    case searchActions.SEARCH_OBJECTS.SUCCESS: {
      const { result, search, locale } = action.payload;
      return {
        ...state,
        searchObjectsResults: isEmpty(search)
          ? []
          : result.map(serverWObj => getClientWObj(serverWObj, locale)),
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

    case searchActions.SEARCH_USERS.SUCCESS: {
      const { result, search } = action.payload;
      return {
        ...state,
        searchUsersResults: isEmpty(search) ? [] : result,
      };
    }
    case searchActions.CLEAR_SEARCH_OBJECTS_RESULT: {
      return {
        ...state,
        searchObjectsResults: [],
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
export const searchObjectTypesResults = state => state.searchObjectTypesResults;
