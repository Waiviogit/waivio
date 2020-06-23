import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { AutoComplete, Icon, Input } from 'antd';
import { debounce, isEmpty } from 'lodash';
import {
  resetSearchAutoCompete,
  searchAutoComplete,
  saveBeneficiariesUsers,
} from '../../search/searchActions';
import { getUserMetadata } from '../../user/usersActions';
import { getAutoCompleteSearchResults } from '../../reducers';
import Avatar from '../../components/Avatar';
import WeightTag from '../../components/WeightTag';

@injectIntl
@connect(
  state => ({
    autoCompleteSearchResults: getAutoCompleteSearchResults(state),
  }),
  {
    searchAutoComplete,
    getUserMetadata,
    resetSearchAutoCompete,
    saveBeneficiariesUsers,
  },
)
class BeneficiariesFindUsers extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    autoCompleteSearchResults: PropTypes.oneOfType([
      PropTypes.shape(),
      PropTypes.arrayOf(PropTypes.shape()),
    ]),
    searchAutoComplete: PropTypes.func.isRequired,
    resetSearchAutoCompete: PropTypes.func.isRequired,
    saveBeneficiariesUsers: PropTypes.func.isRequired,
  };
  static defaultProps = {
    autoCompleteSearchResults: {},
  };

  constructor(props) {
    super(props);

    this.state = {
      dropdownOpen: false,
      searchString: '',
    };

    this.handleSelect = this.handleSelect.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleSearchForInput = this.handleSearchForInput.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
  }

  debouncedSearch = debounce(value => this.props.searchAutoComplete(value, 3, 15), 800);

  prepareOptions = searchResults => {
    const dataSource = [];
    if (!isEmpty(searchResults.users)) dataSource.push(searchResults.users);
    return dataSource;
  };

  handleSearch(value) {
    this.debouncedSearch(value);
    this.setState({ dropdownOpen: true });
  }

  handleSelect(value) {
    this.setState({ searchString: value, dropdownOpen: false });
    this.handleClearSearchData();
    this.props.saveBeneficiariesUsers(value);
  }

  handleOnChange(value) {
    this.setState({
      searchString: value || '',
    });
  }

  handleClearSearchData = () =>
    this.setState({ searchString: '' }, this.props.resetSearchAutoCompete);

  handleSearchForInput(e) {
    e.preventDefault();
    this.props.resetSearchAutoCompete();
    this.setState({
      searchString: '',
      dropdownOpen: false,
    });
    this.handleClearSearchData();
  }

  renderOption = user => {
    const { Option } = AutoComplete;
    return (
      <Option key={user.account} text={user.wobjects_weight}>
        <div className="beneficiariesFindUsers__search-content-wrap">
          <Avatar username={user.account} size={40} />
          <div className="beneficiariesFindUsers__search-content">{user.account}</div>
          <span className="beneficiariesFindUsers__search-expertize">
            <WeightTag weight={user.wobjects_weight} />
            &middot;
            <span className="beneficiariesFindUsers__search-follow-counter">
              {user.followers_count}
            </span>
          </span>
        </div>
      </Option>
    );
  };

  handleOnBlure = () => {
    this.setState({ dropdownOpen: false });
  };

  handleOnFocus = () => {
    if (this.state.searchString) {
      this.setState({ dropdownOpen: true });
    }
  };

  render() {
    const { intl, autoCompleteSearchResults } = this.props;
    const dropdownOptions = this.prepareOptions(autoCompleteSearchResults);
    const options = dropdownOptions[0] ? dropdownOptions[0].map(this.renderOption) : [];

    return (
      <div className="beneficiariesFindUsers">
        <div className="beneficiariesFindUsers-layout">
          <div className="beneficiariesFindUsers__input-container" onBlur={this.handleOnBlur}>
            <AutoComplete
              dropdownClassName="beneficiariesFindUsers__search-dropdown-container"
              dataSource={options}
              onSearch={this.handleSearch}
              onSelect={this.handleSelect}
              onChange={this.handleOnChange}
              defaultActiveFirstOption={false}
              dropdownMatchSelectWidth={false}
              value={this.state.searchString}
              open={this.state.dropdownOpen}
              onFocus={this.handleOnFocus}
              onBlur={this.handleOnBlure}
              optionLabelProp="value"
            >
              <Input
                onPressEnter={this.handleSearchForInput}
                placeholder={intl.formatMessage({
                  id: 'find_users_placeholder',
                  defaultMessage: 'Find users',
                })}
              />
            </AutoComplete>
            {!!this.state.searchString.length && (
              <Icon
                type="close-circle"
                style={{ fontSize: '12px' }}
                theme="filled"
                onClick={this.handleClearSearchData}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default BeneficiariesFindUsers;
