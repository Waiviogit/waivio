import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { AutoComplete } from 'antd';
import _ from 'lodash';
import { clearSearchObjectsResults, searchUsersAutoCompete } from '../../search/searchActions';
import { getSearchUsersResults } from '../../reducers';
import './SearchUsersAutocomplete.less';
// import ObjectSearchCard from '../ObjectSearchCard/ObjectSearchCard';

import { linkRegex } from '../../helpers/regexHelpers';

@injectIntl
@connect(
  state => ({
    searchUsersResults: getSearchUsersResults(state),
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
    itemsIdsToOmit: [],
    placeholder: '',
    disabled: false,
    autoFocus: true,
  };
  static propTypes = {
    intl: PropTypes.shape,
    searchUsersResults: PropTypes.shape,
    searchUsers: PropTypes.func,
    itemsIdsToOmit: PropTypes.arrayOf(PropTypes.string),
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    autoFocus: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.state = {
      searchString: '',
      isOptionSelected: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.debouncedSearchByUser = this.debouncedSearchByUser.bind(this);
    // this.handleSelect = this.handleSelect.bind(this);
  }

  debouncedSearchByUser = _.debounce(searchString => this.props.searchUsers(searchString));

  handleSearch(value) {
    let val = value;
    const link = val.match(linkRegex);
    if (link && link.length > 0 && link[0] !== '') {
      const permlink = link[0].split('/');
      val = permlink[permlink.length - 1].replace('@', '');
    }
    if (val) {
      this.debouncedSearchByUser(val);
    }
  }

  handleChange(value) {
    this.setState({ searchString: value });
  }

  render() {
    const { searchString } = this.state;
    const { intl, searchUsersResults, itemsIdsToOmit, disabled, autoFocus } = this.props;
    console.log('searchUsersResults', searchString);
    const searchUsersOptions = searchString
      ? searchUsersResults
          .filter(obj => !itemsIdsToOmit.includes(obj.id))
          .map(obj => (
            <AutoComplete.Option key={obj.id} label={obj.id} className="obj-search-option item">
              {console.log(obj)}
              {/* <ObjectSearchCard object={obj} name={obj.name} type={obj.type}/> */}
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
      >
        {searchUsersOptions}
      </AutoComplete>
    );
  }
}

export default SearchUsersAutocomplete;
