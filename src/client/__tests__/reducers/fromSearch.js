import {
  getAutoCompleteSearchResults,
  getSearchLoading,
  getSearchObjectsResults,
  getSearchResults,
  getSearchUsersResults,
  searchObjectTypesResults,
} from '../../store/searchStore/searchSelectors';

jest.mock('../../vendor/steemitHelpers.js', () => {});

describe('fromSearch', () => {
  const state = {
    search: {
      loading: 'loading',
      searchResults: 'searchResults',
      autoCompleteSearchResults: 'autoCompleteSearchResults',
      searchObjectsResults: 'searchObjectsResults',
      searchUsersResults: 'searchUsersResults',
      searchObjectTypesResults: 'searchObjectTypesResults',
    },
  };

  it('Should return loading', () => {
    expect(getSearchLoading(state)).toEqual('loading');
  });

  it('Should return searchResults', () => {
    expect(getSearchResults(state)).toEqual('searchResults');
  });

  it('Should return autoCompleteSearchResults', () => {
    expect(getAutoCompleteSearchResults(state)).toEqual('autoCompleteSearchResults');
  });

  it('Should return searchObjectsResults', () => {
    expect(getSearchObjectsResults(state)).toEqual('searchObjectsResults');
  });

  it('Should return searchUsersResults', () => {
    expect(getSearchUsersResults(state)).toEqual('searchUsersResults');
  });

  it('Should return searchObjectTypesResults', () => {
    expect(searchObjectTypesResults(state)).toEqual('searchObjectTypesResults');
  });
});
