import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { AutoComplete } from 'antd';
import _ from 'lodash';
import {
  clearSearchObjectsResults,
  searchUsersAutoCompete,
} from '../../../store/searchStore/searchActions';
import Avatar from '../Avatar';
import { pendingSearch } from '../../search/helpers';
import {
  getIsStartSearchUser,
  getSearchUsersResults,
} from '../../../store/searchStore/searchSelectors';

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
    setSearchString: () => {},
    handleSelect: () => {},
    itemsIdsToOmit: [],
    placeholder: '',
    disabled: false,
    autoFocus: true,
    style: {},
    isSearchUser: false,
    value: undefined,
    onChange: undefined,
    notGuest: false,
    className: '',
  };
  static propTypes = {
    intl: PropTypes.shape(),
    searchUsersResults: PropTypes.arrayOf(PropTypes.shape),
    searchUsers: PropTypes.func,
    handleSelect: PropTypes.func,
    setSearchString: PropTypes.func,
    itemsIdsToOmit: PropTypes.arrayOf(PropTypes.string),
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    autoFocus: PropTypes.bool,
    style: PropTypes.shape({}),
    isSearchUser: PropTypes.bool,
    notGuest: PropTypes.bool,
    onChange: PropTypes.func,
    className: PropTypes.string,
  };

  state = {
    searchString: '',
    isOptionSelected: false,
    error: false,
  };

  debouncedSearchByUser = _.debounce(
    searchString => this.props.searchUsers(searchString, 15, this.props.notGuest),
    500,
  );

  handleSearch = value => {
    this.debouncedSearchByUser(value);
  };

  handleChange = value => {
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(value);
    }
    this.setState({ searchString: value });
    this.props.setSearchString(value);
  };

  handleSelect = value => {
    const selectedUsers = this.props.searchUsersResults.find(obj => obj.account === value);

    this.props.handleSelect(selectedUsers);
    this.setState({ searchString: '', error: false });
    this.props.setSearchString('');
  };

  handleBlur = () => {
    if (this.state.searchString) this.setState({ error: true });
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
      className,
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
      <React.Fragment>
        <AutoComplete
          onChange={this.handleChange}
          onSelect={this.handleSelect}
          onSearch={this.handleSearch}
          optionLabelProp={'label'}
          placeholder={
            !this.props.placeholder
              ? intl.formatMessage({
                  id: 'users_auto_complete_placeholder',
                  defaultMessage: 'Find users',
                })
              : this.props.placeholder
          }
          value={searchString}
          autoFocus={autoFocus}
          disabled={disabled}
          style={style}
          className={className}
          onBlur={this.handleBlur}
        >
          {isSearchUser ? pendingSearch(searchString, intl) : searchUsersOptions}
        </AutoComplete>
        {this.state.error && (
          <span className="SearchUser__error">The user must be selected from the search</span>
        )}
      </React.Fragment>
    );
  }
}

export default SearchUsersAutocomplete;
