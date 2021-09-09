import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { AutoComplete, Icon, Input } from 'antd';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { debounce, isEmpty } from 'lodash';
import { withRouter } from 'react-router';

import {
  resetSearchAutoCompete,
  searchUsersAutoCompete,
  searchWebsiteObjectsAutoCompete,
  setSearchInBox,
  setShowSearchResult,
  setWebsiteSearchString,
} from '../../../store/searchStore/searchActions';
import { resetWebsiteObjectsCoordinates } from '../../../store/websiteStore/websiteActions';
import {
  getIsStartSearchAutoComplete,
  getSearchFiltersTagCategory,
  getSearchObjectsResults,
  getShowSearchResult,
  getWebsiteMap,
  getWebsiteSearchString,
  getWebsiteSearchType,
  searchObjectTypesResults,
} from '../../../store/searchStore/searchSelectors';

import './WebsiteSearch.less';

const WebsiteSearch = props => {
  const [searchString, setSearchString] = useState('');
  const query = new URLSearchParams(props.location.search);

  const currentSearchMethod = value => {
    localStorage.removeItem('scrollTop');

    if (window.gtag) window.gtag('event', `search_${props.searchType.toLowerCase()}`);
    switch (props.searchType) {
      case 'Users':
        return props.searchUsersAutoCompete(value);
      default:
        return props.searchWebsiteObjectsAutoCompete(value);
    }
  };

  useEffect(() => {
    const querySearch = query.get('searchString');

    if (querySearch) setSearchString(querySearch);
  }, []);

  useEffect(() => {
    if (
      props.isShowResult &&
      !isEmpty(props.searchMap.bottomPoint) &&
      !isEmpty(props.searchMap.topPoint) &&
      !localStorage.getItem('scrollTop')
    ) {
      currentSearchMethod(searchString);
    }
  }, [props.searchType, props.activeFilters, props.searchMap, searchString]);

  useEffect(() => {
    props.resetWebsiteObjectsCoordinates();
  }, [props.searchType, props.activeFilters, props.savedSearchString]);

  const handleSearchAutocomplete = useCallback(
    debounce(value => {
      props.setWebsiteSearchString(value);
      props.setSearchInBox(true);

      if (value) query.set('searchString', value);
      else query.delete('searchString');
      props.history.push(`?${query.toString()}`);
    }, 500),
    [props.searchType],
  );

  const handleResetAutocomplete = () => {
    setSearchString('');
    props.resetSearchAutoCompete();
    handleSearchAutocomplete('');
    props.history.push(`?type=${props.searchType}`);
  };

  const handleOpenSearchPanel = () => {
    if (!props.isShowResult) props.setShowSearchResult(true);
  };

  const handleOnChange = value => setSearchString(value);

  return (
    <div className="WebsiteSearch__wrap">
      <AutoComplete
        className="WebsiteSearch"
        onSearch={handleSearchAutocomplete}
        onChange={handleOnChange}
        dropdownClassName={'WebsiteSearch__dropdown'}
        value={searchString}
      >
        <Input.Search
          size="large"
          placeholder={
            props.placeholder ||
            props.intl.formatMessage({
              id: 'find_restaurants_and_dishes',
              defaultMessage: 'Find restaurants and dishes',
            })
          }
          onClick={handleOpenSearchPanel}
        />
      </AutoComplete>
      {!!searchString.length && (
        <Icon type="close" onClick={handleResetAutocomplete} className="WebsiteSearch__close" />
      )}
    </div>
  );
};

WebsiteSearch.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
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
  placeholder: PropTypes.string.isRequired,
  savedSearchString: PropTypes.string.isRequired,
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
  state => ({
    searchByObject: getSearchObjectsResults(state),
    searchByObjectType: searchObjectTypesResults(state),
    isStartSearchAutoComplete: getIsStartSearchAutoComplete(state),
    searchType: getWebsiteSearchType(state),
    activeFilters: getSearchFiltersTagCategory(state),
    isShowResult: getShowSearchResult(state),
    searchMap: getWebsiteMap(state),
    savedSearchString: getWebsiteSearchString(state),
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
)(withRouter(injectIntl(WebsiteSearch)));
