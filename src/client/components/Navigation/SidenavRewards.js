import { AutoComplete, Input, Modal } from 'antd';
import React from 'react';
import { injectIntl } from 'react-intl';
import { NavLink } from 'react-router-dom';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import './Sidenav.less';
import { getAutoCompleteSearchResults, getIsAuthenticated } from '../../reducers';
import { searchAutoComplete } from '../../search/searchActions';
import Avatar from '../Avatar';

@injectIntl
@withRouter
@connect(
  state => ({
    autoCompleteSearchResults: getAutoCompleteSearchResults(state),
    authenticated: getIsAuthenticated(state),
  }),
  {
    searchAutoComplete: search => searchAutoComplete(search, 15, 0, 0),
  },
)
export default class SidenavRewards extends React.Component {
  static propTypes = {
    match: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    history: PropTypes.shape().isRequired,
    autoCompleteSearchResults: PropTypes.oneOfType([
      PropTypes.shape(),
      PropTypes.arrayOf(PropTypes.shape()),
    ]),
    searchAutoComplete: PropTypes.func.isRequired,
    authenticated: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    autoCompleteSearchResults: {},
  };

  constructor(props) {
    super(props);

    this.state = {
      searchBarActive: false,
      popoverVisible: false,
      searchBarValue: '',
      isModalRewardUserOpen: false,
      currentTab: 'active',
    };
    this.handleSelectOnAutoCompleteDropdown = this.handleSelectOnAutoCompleteDropdown.bind(this);
    this.handleAutoCompleteSearch = this.handleAutoCompleteSearch.bind(this);
    this.handleOnChangeForAutoComplete = this.handleOnChangeForAutoComplete.bind(this);
    this.usersSearchLayout = this.usersSearchLayout.bind(this);
    this.handleSearchForInput = this.handleSearchForInput.bind(this);
    this.handleAutoCompleteSearch = this.handleAutoCompleteSearch.bind(this);
  }

  toggleModal = () => {
    this.setState({ isModalRewardUserOpen: !this.state.isModalRewardUserOpen });
  };

  debouncedSearch = _.debounce(value => this.props.searchAutoComplete(value), 300);

  handleOpenModalRewardUser = (e, currentTab, userName) => {
    if (!userName || userName === 'undefined') {
      this.setState({ isModalRewardUserOpen: !this.state.isModalRewardUserOpen, currentTab });
      e.preventDefault();
    }
  };
  hideAutoCompleteDropdown() {
    this.props.searchAutoComplete('');
  }
  handleAutoCompleteSearch(value) {
    this.debouncedSearch(value);
  }

  handleSelectOnAutoCompleteDropdown(value) {
    this.props.history.push({ pathname: `/rewards/${this.state.currentTab}/@${value}` });
  }
  handleSearchForInput() {
    this.hideAutoCompleteDropdown();
  }
  prepareOptions(searchResults) {
    let dataSource = [];
    if (!_.isEmpty(searchResults.accounts))
      dataSource = this.usersSearchLayout(searchResults.accounts);
    return dataSource;
  }

  handleOnChangeForAutoComplete(value, data) {
    if (data.props.marker) this.setState({ searchBarValue: '' });
    else this.setState({ searchBarValue: value });
  }
  usersSearchLayout = accounts =>
    _.map(accounts, option => (
      <AutoComplete.Option
        key={option.account}
        value={option.account}
        className="Topnav__search-autocomplete"
      >
        <div className="Topnav__search-content-wrap">
          <Avatar username={option.account} size={40} />
          <div className="Topnav__search-content">{option.account}</div>
        </div>
      </AutoComplete.Option>
    ));

  render() {
    const { match, intl, autoCompleteSearchResults, authenticated } = this.props;
    const dropdownOptions = this.prepareOptions(autoCompleteSearchResults);
    return (
      <React.Fragment>
        <ul className="Sidenav">
          <li>
            <NavLink to={'/rewards/all'} activeClassName="Sidenav__item--active">
              {intl.formatMessage({
                id: 'all',
                defaultMessage: `All`,
              })}
            </NavLink>
          </li>
          <li>
            <NavLink
              to={`/rewards/active/@${match.params.userName}`}
              activeClassName="Sidenav__item--active"
              onClick={e => this.handleOpenModalRewardUser(e, 'active', match.params.userName)}
            >
              {intl.formatMessage({
                id: 'eligible',
                defaultMessage: `Eligible`,
              })}
            </NavLink>
          </li>
          <li>
            <NavLink
              to={`/rewards/reserved/@${match.params.userName}`}
              activeClassName="Sidenav__item--active"
              onClick={e => this.handleOpenModalRewardUser(e, 'reserved', match.params.userName)}
            >
              {intl.formatMessage({
                id: 'reserved',
                defaultMessage: `Reserves`,
              })}
            </NavLink>
          </li>
          <li>
            <NavLink
              to={`/rewards/history/@${match.params.userName}`}
              activeClassName="Sidenav__item--active"
              onClick={e => this.handleOpenModalRewardUser(e, 'history', match.params.userName)}
            >
              {intl.formatMessage({
                id: 'history',
                defaultMessage: `History`,
              })}
            </NavLink>
          </li>
          ------------------------------
          {authenticated && (
            <li>
              <NavLink to={`/rewards/create`} activeClassName="Sidenav__item--active">
                {intl.formatMessage({
                  id: 'create',
                  defaultMessage: `Create`,
                })}
              </NavLink>
            </li>
          )}
          <li>
            <NavLink
              to={`/rewards/created/@${match.params.userName}`}
              activeClassName="Sidenav__item--active"
              onClick={e => this.handleOpenModalRewardUser(e, 'created', match.params.userName)}
            >
              {intl.formatMessage({
                id: 'created',
                defaultMessage: `Created`,
              })}
            </NavLink>
          </li>
        </ul>
        {this.state.isModalRewardUserOpen && (
          <Modal
            width={600}
            title=""
            visible={this.state.isModalRewardUserOpen}
            onCancel={this.toggleModal}
            footer={null}
          >
            <AutoComplete
              style={{ width: '95%' }}
              dropdownClassName=""
              dataSource={dropdownOptions}
              onSearch={this.handleAutoCompleteSearch}
              onSelect={this.handleSelectOnAutoCompleteDropdown}
              onChange={this.handleOnChangeForAutoComplete}
              defaultActiveFirstOption={false}
              dropdownMatchSelectWidth={false}
              optionLabelProp="value"
              value={this.state.searchBarValue}
            >
              <Input
                ref={ref => {
                  this.searchInputRef = ref;
                }}
                onPressEnter={this.handleSearchForInput}
                placeholder={intl.formatMessage({
                  id: 'rewardsUser',
                  defaultMessage: 'Select a user to display the rewards',
                })}
                autoCapitalize="off"
                autoCorrect="off"
              />
            </AutoComplete>
          </Modal>
        )}
      </React.Fragment>
    );
  }
}
