// --- SearchUsersAutocomplete.js ---
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
    forwardedRef: null,
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
    forwardedRef: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.shape({ current: PropTypes.node }),
    ]),
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
    this.setState({ searchString: value });
    this.props.setSearchString(value);
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(value);
    }
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
      placeholder,
      forwardedRef,
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
      <>
        <AutoComplete
          ref={forwardedRef}
          onChange={this.handleChange}
          onSelect={this.handleSelect}
          onSearch={this.handleSearch}
          optionLabelProp={'label'}
          placeholder={
            placeholder ||
            intl.formatMessage({
              id: 'users_auto_complete_placeholder',
              defaultMessage: 'Find users',
            })
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
      </>
    );
  }
}

const mapStateToProps = state => ({
  searchUsersResults: getSearchUsersResults(state),
  isSearchUser: getIsStartSearchUser(state),
});

const mapDispatchToProps = {
  searchUsers: searchUsersAutoCompete,
  clearSearchResults: clearSearchObjectsResults,
};

const ConnectedComponent = injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(SearchUsersAutocomplete),
);

export default React.forwardRef((props, ref) => (
  <ConnectedComponent {...props} forwardedRef={ref} />
));
