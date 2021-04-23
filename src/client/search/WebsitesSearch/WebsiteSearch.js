import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { AutoComplete, Icon, Input } from 'antd';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { debounce, isEmpty } from 'lodash';

import {
  resetSearchAutoCompete,
  searchUsersAutoCompete,
  searchWebsiteObjectsAutoCompete,
  setSearchInBox,
  setShowSearchResult,
  setWebsiteSearchString,
} from '../../store/searchStore/searchActions';
import { resetWebsiteObjectsCoordinates } from '../../store/websiteStore/websiteActions';
import {
  getIsStartSearchAutoComplete,
  getSearchFiltersTagCategory,
  getSearchObjectsResults,
  getShowSearchResult,
  getWebsiteMap,
  getWebsiteSearchType,
  searchObjectTypesResults,
} from '../../store/searchStore/searchSelectors';

import './WebsiteSearch.less';

const WebsiteSearch = props => {
  const [searchString, setSearchString] = useState('');

  const currentSearchMethod = useCallback(
    value => {
      props.setWebsiteSearchString(value);
      props.setSearchInBox(true);

      if (window.gtag) window.gtag('event', `search_${props.searchType.toLowerCase()}`);

      switch (props.searchType) {
        case 'Users':
          return props.searchUsersAutoCompete(value);
        default:
          return props.searchWebsiteObjectsAutoCompete(value);
      }
    },
    [props.searchType, searchString, props.location.search],
  );

  useEffect(() => {
    const querySearch = props.query.get('searchString');

    if (querySearch) setSearchString(querySearch);
  }, []);

  useEffect(() => {
    if (props.isShowResult && !isEmpty(props.searchMap) && !localStorage.getItem('scrollTop'))
      currentSearchMethod(searchString);
  }, [props.searchType, props.activeFilters, props.searchMap]);

  useEffect(() => {
    props.resetWebsiteObjectsCoordinates();
  }, [props.searchType, props.activeFilters, searchString]);

  const handleSearchAutocomplete = useCallback(
    debounce(value => {
      currentSearchMethod(value);
    }, 200),
    [props.searchType],
  );

  const handleSearch = value => {
    handleSearchAutocomplete(value);
    if (value) props.query.set('searchString', value);
    else props.query.delete('searchString');

    props.history.push(`/?${props.query.toString()}`);
  };

  const handleResetAutocomplete = () => {
    setSearchString('');
    props.resetSearchAutoCompete();
    handleSearchAutocomplete('');

    props.history.push(`/?type=${props.searchType}`);
  };

  return (
    <div>
      <AutoComplete
        className="WebsiteSearch"
        onSearch={handleSearch}
        onChange={value => setSearchString(value)}
        dropdownClassName={'WebsiteSearch__dropdown'}
        value={searchString}
      >
        <Input.Search
          size="large"
          placeholder={props.intl.formatMessage({
            id: 'find_restaurants_and_dishes',
            defaultMessage: 'Find restaurants and dishes',
          })}
          onClick={() => props.setShowSearchResult(true)}
        />
      </AutoComplete>
      {!!searchString.length && (
        <Icon
          type="close"
          onClick={handleResetAutocomplete}
          style={{ position: 'relative', left: '-20px', cursor: 'pointer', zIndex: 5 }}
        />
      )}
    </div>
  );
};

WebsiteSearch.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
  query: PropTypes.shape({
    get: PropTypes.func,
    set: PropTypes.func,
    delete: PropTypes.func,
    toString: PropTypes.func,
  }).isRequired,
  location: PropTypes.shape({
    search: PropTypes.string,
  }).isRequired,
  resetSearchAutoCompete: PropTypes.func.isRequired,
  setWebsiteSearchString: PropTypes.func.isRequired,
  searchWebsiteObjectsAutoCompete: PropTypes.func.isRequired,
  searchUsersAutoCompete: PropTypes.func.isRequired,
  setShowSearchResult: PropTypes.func.isRequired,
  setSearchInBox: PropTypes.func.isRequired,
  resetWebsiteObjectsCoordinates: PropTypes.func.isRequired,
  searchType: PropTypes.string.isRequired,
  activeFilters: PropTypes.arrayOf(PropTypes.shape()),
  isShowResult: PropTypes.bool.isRequired,
  searchMap: PropTypes.shape().isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};

WebsiteSearch.defaultProps = {
  activeFilters: [],
};

export default connect(
  (state, ownProps) => ({
    searchByObject: getSearchObjectsResults(state),
    searchByObjectType: searchObjectTypesResults(state),
    isStartSearchAutoComplete: getIsStartSearchAutoComplete(state),
    searchType: getWebsiteSearchType(state),
    activeFilters: getSearchFiltersTagCategory(state),
    isShowResult: getShowSearchResult(state),
    searchMap: getWebsiteMap(state),
    query: new URLSearchParams(ownProps.location.search),
  }),
  {
    resetSearchAutoCompete,
    searchWebsiteObjectsAutoCompete,
    searchUsersAutoCompete,
    setWebsiteSearchString,
    setShowSearchResult,
    setSearchInBox,
    resetWebsiteObjectsCoordinates,
  },
)(injectIntl(WebsiteSearch));
