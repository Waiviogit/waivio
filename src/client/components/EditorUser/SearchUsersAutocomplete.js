import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { AutoComplete, Icon } from 'antd';
import _ from 'lodash';
import { clearSearchObjectsResults, searchUsersAutoCompete } from '../../search/searchActions';
import { getIsStartSearchUser, getSearchUsersResults } from '../../reducers';
import Avatar from '../Avatar';

import './SearchUsersAutocomplete.less';

@injectIntl
@connect(
  state => ({
    searchUsersResults: getSearchUsersResults(state),
    isSearchUser: getIsStartSearchUser(state),
  }),
  {
    searchUsers: searchUsersAutoCompete,
    clearSearchResults: clearSearchObjectsResults,
  },
)
class SearchUsersAutocomplete extends React.Component {
  static defaultProps = {
    intl: {},
    searchUsersResults: [],
    searchUsers: () => {},
    handleSelect: () => {},
    itemsIdsToOmit: [],
    placeholder: '',
    disabled: false,
    autoFocus: true,
    style: {},
    isSearchUser: false,
  };
  static propTypes = {
    intl: PropTypes.shape(),
    searchUsersResults: PropTypes.arrayOf(PropTypes.shape),
    searchUsers: PropTypes.func,
    handleSelect: PropTypes.func,
    itemsIdsToOmit: PropTypes.arrayOf(PropTypes.string),
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    autoFocus: PropTypes.bool,
    style: PropTypes.shape({}),
    isSearchUser: PropTypes.bool,
  };

  state = {
    searchString: '',
    isOptionSelected: false,
  };

  debouncedSearchByUser = _.debounce(searchString => this.props.searchUsers(searchString), 800);

  handleSearch = value => {
    this.debouncedSearchByUser(value);
  };

  handleChange = value => {
    this.setState({ searchString: value });
  };

  handleSelect = value => {
    const selectedUsers = this.props.searchUsersResults.find(obj => obj.account === value);
    this.props.handleSelect(selectedUsers);
    this.setState({ searchString: '' });
  };

  pendingSearch = () => {
    const downBar = (
      <AutoComplete.Option disabled key="all" className="Topnav__search-pending">
        <div className="pending-status">
          {this.props.intl.formatMessage(
            {
              id: 'search_all_results_for',
              defaultMessage: 'Search all results for {search}...',
            },
            { search: this.state.searchString },
          )}
          {<span> &nbsp;</span>}
          {<Icon type="loading" />}
        </div>
      </AutoComplete.Option>
    );
    return [downBar];
  };

  render() {
    const { searchString } = this.state;
    const {
      intl,
      searchUsersResults,
      itemsIdsToOmit,
      disabled,
      autoFocus,
      style,
      isSearchUser,
    } = this.props;
    const searchUsersOptions = searchString
      ? searchUsersResults
          .filter(obj => !itemsIdsToOmit.includes(obj.account))
          .map(obj => (
            <AutoComplete.Option key={obj.account} label={obj.account} className="SearchUser item">
              <div className="SearchUser">
                <Avatar username={obj.account} size={40} />
                <div className="SearchUser__content">{obj.account}</div>
              </div>
            </AutoComplete.Option>
          ))
      : [];
    return (
      <AutoComplete
        onChange={this.handleChange}
        onSelect={this.handleSelect}
        onSearch={this.handleSearch}
        optionLabelProp={'label'}
        placeholder={
          !this.props.placeholder
            ? intl.formatMessage({
                id: 'objects_auto_complete_placeholder',
                defaultMessage: 'Find objects',
              })
            : this.props.placeholder
        }
        value={searchString}
        autoFocus={autoFocus}
        disabled={disabled}
        style={style}
      >
        {isSearchUser ? this.pendingSearch() : searchUsersOptions}
      </AutoComplete>
    );
  }
}

export default SearchUsersAutocomplete;
