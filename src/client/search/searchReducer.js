import _ from 'lodash';
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
      const askSteemResults = _.get(action.payload, 0, []);
      const steemLookupResults = _.get(action.payload, 1, []);
      const parsedSteemLookupResults = _.map(steemLookupResults, accountDetails => ({
        ...accountDetails,
        reputation: formatter.reputation(accountDetails.reputation),
        name: accountDetails.account,
        type: 'user',
      }));
      const sortedSteemLookupResults = _.sortBy(parsedSteemLookupResults, 'reputation').reverse();
      const searchResults = _.compact(_.concat(sortedSteemLookupResults, askSteemResults));
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
      return {
        ...state,
        autoCompleteSearchResults: _.isEmpty(search) ? [] : result,
      };
    }
    case searchActions.SEARCH_OBJECTS.SUCCESS: {
      const { result, search } = action.payload;
      return {
        ...state,
        searchObjectsResults: _.isEmpty(search)
          ? []
          : result.map(serverWObj => getClientWObj(serverWObj)),
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
