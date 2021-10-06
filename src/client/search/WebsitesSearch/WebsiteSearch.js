import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { AutoComplete, Icon, Input } from 'antd';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { debounce } from 'lodash';
import { withRouter } from 'react-router';

import {
  resetSearchAutoCompete,
  setSearchInBox,
  setShowSearchResult,
  setWebsiteSearchString,
} from '../../../store/searchStore/searchActions';
import {
  getShowSearchResult,
  getWebsiteSearchType,
} from '../../../store/searchStore/searchSelectors';

import './WebsiteSearch.less';

const WebsiteSearch = props => {
  const [searchString, setSearchString] = useState('');
  const query = new URLSearchParams(props.location.search);

  useEffect(() => {
    const querySearch = query.get('searchString');

    if (querySearch) setSearchString(querySearch);
  }, []);

  const handleSearchAutocomplete = useCallback(
    debounce(value => {
      if (window.gtag) window.gtag('event', `search_${props.searchType.toLowerCase()}`);

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
  setShowSearchResult: PropTypes.func.isRequired,
  setSearchInBox: PropTypes.func.isRequired,
  searchType: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  isShowResult: PropTypes.bool.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};

WebsiteSearch.defaultProps = {
  activeFilters: [],
};

export default connect(
  state => ({
    searchType: getWebsiteSearchType(state),
    isShowResult: getShowSearchResult(state),
  }),
  {
    resetSearchAutoCompete,
    setWebsiteSearchString,
    setShowSearchResult,
    setSearchInBox,
  },
)(withRouter(injectIntl(WebsiteSearch)));
