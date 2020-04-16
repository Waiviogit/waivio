import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { AutoComplete, Icon, Input } from 'antd';
import { debounce, isEmpty } from 'lodash';
import {
  resetSearchAutoCompete,
  searchAutoComplete,
  searchObjectsAutoCompete,
  searchUsersAutoCompete,
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
    searchObjectsAutoCompete,
    searchAutoComplete,
    getUserMetadata,
    searchUsersAutoCompete,
    resetSearchAutoCompete,
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
    searchUsersAutoCompete: PropTypes.func.isRequired,
  };
  static defaultProps = {
    autoCompleteSearchResults: {},
    username: undefined,
  };

  static markers = {
    USER: 'user',
    WOBJ: 'wobj',
    TYPE: 'type',
    SELECT_BAR: 'searchSelectBar',
  };

  constructor(props) {
    super(props);

    this.state = {
      searchBarActive: false,
      popoverVisible: false,
      searchBarValue: '',
      notificationsPopoverVisible: false,
      searchData: '',
      currentItem: 'All',
      dropdownOpen: false,
      selectColor: false,
      searchString: '',
    };

    this.handleSelectOnAutoCompleteDropdown = this.handleSelectOnAutoCompleteDropdown.bind(this);
    this.handleAutoCompleteSearch = this.handleAutoCompleteSearch.bind(this);
    this.handleSearchForInput = this.handleSearchForInput.bind(this);
    this.handleOnChangeForAutoComplete = this.handleOnChangeForAutoComplete.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.searchBarValue !== this.state.searchBarValue &&
      this.state.searchBarValue !== ''
    ) {
      this.debouncedSearchByUser(this.state.searchBarValue);
    }
  }

  debouncedSearch = debounce(value => this.props.searchAutoComplete(value, 3, 15), 200);

  debouncedSearchByUser = debounce(searchString => this.props.searchUsersAutoCompete(searchString));

  renderTitle = title => <span>{title}</span>;

  prepareOptions = searchResults => {
    const dataSource = [];
    if (!isEmpty(searchResults.users)) dataSource.push(searchResults.users);
    return dataSource;
  };

  handleAutoCompleteSearch(value) {
    this.debouncedSearch(value);
    this.setState({ dropdownOpen: true, searchString: value });
  }

  handleSelectOnAutoCompleteDropdown(value, data) {
    if (data.props.marker === BeneficiariesFindUsers.markers.SELECT_BAR) {
      const optionValue = value.split('#')[1];

      const nextState = {
        searchData: {
          subtype: optionValue,
          type: data.props.type,
        },
        dropdownOpen: true,
        currentItem: optionValue,
      };

      if (data.props.type === 'user' || data.props.type === 'type') {
        this.setState(nextState);
        return;
      }
    }

    this.setState({ dropdownOpen: false });
    this.hideAutoCompleteDropdown();
  }

  handleOnChangeForAutoComplete(value) {
    if (!value) {
      this.setState({
        searchBarValue: '',
        searchData: '',
        currentItem: '',
      });
    }
    this.setState({
      searchBarValue: value,
      searchData: {
        subtype: 'Users',
        type: 'user',
      },
      currentItem: 'Users',
    });
  }

  handleClearSearchData = () =>
    this.setState(
      {
        searchData: '',
        searchBarValue: '',
      },
      this.props.resetSearchAutoCompete,
    );

  handleSearchForInput(event) {
    const value = event.target.value;
    console.log(value);
    this.props.resetSearchAutoCompete();
    this.setState({
      searchBarValue: '',
      searchData: '',
      currentItem: '',
      searchBarActive: false,
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
              onSearch={this.handleAutoCompleteSearch}
              onSelect={this.handleSelectOnAutoCompleteDropdown}
              onChange={this.handleOnChangeForAutoComplete}
              defaultActiveFirstOption={false}
              dropdownMatchSelectWidth={false}
              value={this.state.searchBarValue}
              open={this.state.dropdownOpen}
              onFocus={this.handleOnFocus}
            >
              <Input
                onPressEnter={this.handleSearchForInput}
                placeholder={intl.formatMessage({
                  id: 'find_users_placeholder',
                  defaultMessage: 'Find users',
                })}
              />
            </AutoComplete>
            {!!this.state.searchBarValue.length && (
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
