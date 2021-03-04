import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { AutoComplete, Icon, Input } from 'antd';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { debounce, isEmpty } from 'lodash';

import {
  getIsStartSearchAutoComplete,
  getSearchFiltersTagCategory,
  getSearchObjectsResults,
  getShowSearchResult,
  getWebsiteMap,
  getWebsiteSearchType,
  searchObjectTypesResults,
} from '../../reducers';
import {
  resetSearchAutoCompete,
  searchUsersAutoCompete,
  searchWebsiteObjectsAutoCompete,
  setShowSearchResult,
  setWebsiteSearchString,
} from '../searchActions';

import './WebsiteSearch.less';

const WebsiteSearch = props => {
  const [searchString, setSearchString] = useState('');

  const currentSearchMethod = value => {
    props.setWebsiteSearchString(value);
    switch (props.searchType) {
      case 'Users':
        return props.searchUsersAutoCompete(value);
      default:
        return props.searchWebsiteObjectsAutoCompete(value);
    }
  };

  useEffect(() => {
    if (props.isShowResult && !isEmpty(props.searchMap)) currentSearchMethod(searchString);
  }, [props.searchType, props.activeFilters, props.searchMap]);

  const handleSearchAutocomplete = useCallback(
    debounce(value => currentSearchMethod(value), 300),
    [props.searchType],
  );

  const handleSearch = value => {
    handleSearchAutocomplete(value);
    setSearchString(value);
  };

  const handleResetAutocomplete = () => {
    setSearchString('');
    props.resetSearchAutoCompete();
    handleSearchAutocomplete('');
  };

  return (
    <div>
      <AutoComplete
        className="WebsiteSearch"
        onSearch={handleSearch}
        value={searchString}
        dropdownClassName={'WebsiteSearch__dropdown'}
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
  resetSearchAutoCompete: PropTypes.func.isRequired,
  setWebsiteSearchString: PropTypes.func.isRequired,
  searchWebsiteObjectsAutoCompete: PropTypes.func.isRequired,
  searchUsersAutoCompete: PropTypes.func.isRequired,
  setShowSearchResult: PropTypes.func.isRequired,
  searchType: PropTypes.string.isRequired,
  activeFilters: PropTypes.arrayOf,
  isShowResult: PropTypes.string.isRequired,
  searchMap: PropTypes.string.isRequired,
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
  }),
  {
    resetSearchAutoCompete,
    searchWebsiteObjectsAutoCompete,
    searchUsersAutoCompete,
    setWebsiteSearchString,
    setShowSearchResult,
  },
)(injectIntl(WebsiteSearch));
