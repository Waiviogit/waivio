import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty, forEach, debounce, get, isUndefined, size, filter, includes, map } from 'lodash';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { AutoComplete, Icon, Input, Menu } from 'antd';
import classNames from 'classnames';
import {
  resetSearchAutoCompete,
  searchAutoComplete,
  searchObjectsAutoCompete,
  searchObjectTypesAutoCompete,
  searchUsersAutoCompete,
} from '../../search/searchActions';
import { getUserMetadata } from '../../user/usersActions';
import {
  getIsStartSearchAutoComplete,
  getAuthenticatedUserMetaData,
  getAutoCompleteSearchResults,
  getIsLoadingNotifications,
  getNotifications,
  getSearchObjectsResults,
  getSearchUsersResults,
  searchObjectTypesResults,
} from '../../reducers';
import { PARSED_NOTIFICATIONS } from '../../../common/constants/notifications';
import BTooltip from '../BTooltip';
import Avatar from '../Avatar';
import PopoverMenu, { PopoverMenuItem } from '../PopoverMenu/PopoverMenu';
import Popover from '../Popover';
import Notifications from './Notifications/Notifications';
import LanguageSettings from './LanguageSettings';
import { getFieldWithMaxWeight } from '../../object/wObjectHelper';
import { objectFields } from '../../../common/constants/listOfFields';
import ObjectAvatar from '../ObjectAvatar';
import ModalSignUp from './ModalSignUp/ModalSignUp';
import ModalSignIn from './ModlaSignIn/ModalSignIn';
import listOfObjectTypes from '../../../common/constants/listOfObjectTypes';
import { replacer } from '../../helpers/parser';
import WeightTag from '../WeightTag';
import { getApprovedField } from '../../helpers/wObjectHelper';
import { pendingSearch } from '../../search/Search';

import './Topnav.less';

@injectIntl
@withRouter
@connect(
  state => ({
    autoCompleteSearchResults: getAutoCompleteSearchResults(state),
    searchByObject: getSearchObjectsResults(state),
    searchByUser: getSearchUsersResults(state),
    searchByObjectType: searchObjectTypesResults(state),
    notifications: getNotifications(state),
    userMetaData: getAuthenticatedUserMetaData(state),
    loadingNotifications: getIsLoadingNotifications(state),
    isStartSearchAutoComplete: getIsStartSearchAutoComplete(state),
  }),
  {
    searchObjectsAutoCompete,
    searchAutoComplete,
    getUserMetadata,
    searchUsersAutoCompete,
    searchObjectTypesAutoCompete,
    resetSearchAutoCompete,
  },
)
class Topnav extends React.Component {
  static propTypes = {
    /* from decorators */
    intl: PropTypes.shape().isRequired,
    history: PropTypes.shape().isRequired,
    location: PropTypes.shape().isRequired,
    /* from connect */
    autoCompleteSearchResults: PropTypes.oneOfType([
      PropTypes.shape(),
      PropTypes.arrayOf(PropTypes.shape()),
    ]),
    notifications: PropTypes.arrayOf(PropTypes.shape()),
    userMetaData: PropTypes.shape(),
    loadingNotifications: PropTypes.bool,
    searchAutoComplete: PropTypes.func.isRequired,
    getUserMetadata: PropTypes.func.isRequired,
    resetSearchAutoCompete: PropTypes.func.isRequired,
    /* passed props */
    username: PropTypes.string,
    onMenuItemClick: PropTypes.func,
    searchObjectsAutoCompete: PropTypes.func.isRequired,
    searchUsersAutoCompete: PropTypes.func.isRequired,
    searchObjectTypesAutoCompete: PropTypes.func.isRequired,
    searchByObject: PropTypes.arrayOf(PropTypes.shape()),
    searchByUser: PropTypes.arrayOf(PropTypes.shape()),
    searchByObjectType: PropTypes.arrayOf(PropTypes.shape()),
    isStartSearchAutoComplete: PropTypes.bool,
  };
  static defaultProps = {
    autoCompleteSearchResults: {},
    searchByObject: [],
    searchByUser: [],
    searchByObjectType: [],
    notifications: [],
    username: undefined,
    onMenuItemClick: () => {},
    userMetaData: {},
    loadingNotifications: false,
    isStartSearchAutoComplete: false,
  };

  static markers = {
    USER: 'user',
    WOBJ: 'wobj',
    TYPE: 'type',
    SELECT_BAR: 'searchSelectBar',
  };

  static handleScrollToTop() {
    if (window) {
      window.scrollTo(0, 0);
    }
  }

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
    };
    this.handleMoreMenuSelect = this.handleMoreMenuSelect.bind(this);
    this.handleMoreMenuVisibleChange = this.handleMoreMenuVisibleChange.bind(this);
    this.handleNotificationsPopoverVisibleChange = this.handleNotificationsPopoverVisibleChange.bind(
      this,
    );
    this.handleCloseNotificationsPopover = this.handleCloseNotificationsPopover.bind(this);
    this.handleSelectOnAutoCompleteDropdown = this.handleSelectOnAutoCompleteDropdown.bind(this);
    this.handleAutoCompleteSearch = this.handleAutoCompleteSearch.bind(this);
    this.handleSearchForInput = this.handleSearchForInput.bind(this);
    this.handleOnChangeForAutoComplete = this.handleOnChangeForAutoComplete.bind(this);
    this.hideAutoCompleteDropdown = this.hideAutoCompleteDropdown.bind(this);
  }

  getTranformSearchCountData = searchResults => {
    const { objectTypesCount, wobjectsCounts, usersCount } = searchResults;

    const wobjectAllCount = wobjectsCounts
      ? wobjectsCounts.reduce((accumulator, currentValue) => accumulator + currentValue.count, 0)
      : null;
    const countAllSearch = objectTypesCount + usersCount + wobjectAllCount;
    const countArr = [{ name: 'All', count: countAllSearch }];

    if (!isEmpty(wobjectsCounts)) {
      const wobjList = listOfObjectTypes.reduce((acc, i) => {
        const index = wobjectsCounts.findIndex(obj => obj.object_type === i);

        if (index >= 0) {
          acc.push(wobjectsCounts[index]);
        }

        return acc;
      }, []);

      forEach(wobjList, current => {
        const obj = {};

        obj.name = current.object_type;
        obj.count = current.count;
        obj.type = 'wobject';
        countArr.push(obj);
      });
    }
    if (objectTypesCount) {
      countArr.push({ name: 'Types', count: objectTypesCount, type: 'type' });
    }
    if (usersCount) {
      countArr.push({ name: 'Users', count: usersCount, type: 'user' });
    }

    return countArr;
  };

  debouncedSearch = debounce(value => this.props.searchAutoComplete(value, 3, 15), 300);

  debouncedSearchByObject = debounce(
    (searchString, objType) => this.props.searchObjectsAutoCompete(searchString, objType),
    300,
  );

  debouncedSearchByUser = debounce(
    searchString => this.props.searchUsersAutoCompete(searchString),
    300,
  );

  debouncedSearchByObjectTypes = debounce(
    searchString => this.props.searchObjectTypesAutoCompete(searchString),
    300,
  );

  handleMoreMenuSelect(key) {
    this.setState({ popoverVisible: false }, () => {
      this.props.onMenuItemClick(key);
    });
  }

  handleMoreMenuVisibleChange(visible) {
    this.setState({ popoverVisible: visible });
  }

  handleNotificationsPopoverVisibleChange(visible) {
    if (visible) {
      this.setState({ notificationsPopoverVisible: visible });
    } else {
      this.handleCloseNotificationsPopover();
    }
  }

  handleCloseNotificationsPopover() {
    this.setState({
      notificationsPopoverVisible: false,
    });
  }

  menuForLoggedOut = () => {
    const { location } = this.props;
    const { searchBarActive } = this.state;
    const next = location.pathname.length > 1 ? location.pathname : '';

    return (
      <div
        className={classNames('Topnav__menu-container Topnav__menu-logged-out', {
          'Topnav__mobile-hidden': searchBarActive,
        })}
      >
        <Menu className="Topnav__menu-container__menu" mode="horizontal">
          <Menu.Item key="signup">
            <ModalSignUp isButton={false} />
          </Menu.Item>
          <Menu.Item key="divider" disabled>
            |
          </Menu.Item>
          <Menu.Item key="login">
            <ModalSignIn next={next} />
          </Menu.Item>
          <Menu.Item key="language">
            <LanguageSettings />
          </Menu.Item>
        </Menu>
      </div>
    );
  };

  menuForLoggedIn = () => {
    const { intl, username, notifications, userMetaData, loadingNotifications } = this.props;
    const { searchBarActive, notificationsPopoverVisible, popoverVisible } = this.state;
    const lastSeenTimestamp = get(userMetaData, 'notifications_last_timestamp');
    const notificationsCount = isUndefined(lastSeenTimestamp)
      ? size(notifications)
      : size(
          filter(
            notifications,
            notification =>
              lastSeenTimestamp < notification.timestamp &&
              includes(PARSED_NOTIFICATIONS, notification.type),
          ),
        );
    const displayBadge = notificationsCount > 0;
    const notificationsCountDisplay = notificationsCount > 99 ? '99+' : notificationsCount;

    return (
      <div
        className={classNames('Topnav__menu-container', {
          'Topnav__mobile-hidden': searchBarActive,
        })}
      >
        <Menu selectedKeys={[]} className="Topnav__menu-container__menu" mode="horizontal">
          <Menu.Item key="write">
            <BTooltip
              placement="bottom"
              title={intl.formatMessage({ id: 'write_post', defaultMessage: 'Write post' })}
              mouseEnterDelay={1}
              overlayClassName="Topnav__notifications-tooltip"
            >
              <Link to="/editor" className="Topnav__link Topnav__link--action">
                <i className="iconfont icon-write" />
              </Link>
            </BTooltip>
          </Menu.Item>
          <Menu.Item key="notifications" className="Topnav__item--badge">
            <BTooltip
              placement="bottom"
              title={intl.formatMessage({ id: 'notifications', defaultMessage: 'Notifications' })}
              overlayClassName="Topnav__notifications-tooltip"
              mouseEnterDelay={1}
            >
              <Popover
                placement="bottomRight"
                trigger="click"
                content={
                  <Notifications
                    notifications={notifications}
                    onNotificationClick={this.handleCloseNotificationsPopover}
                    currentAuthUsername={username}
                    lastSeenTimestamp={lastSeenTimestamp}
                    loadingNotifications={loadingNotifications}
                    getUpdatedUserMetadata={this.props.getUserMetadata}
                  />
                }
                visible={notificationsPopoverVisible}
                onVisibleChange={this.handleNotificationsPopoverVisibleChange}
                overlayClassName="Notifications__popover-overlay"
                title={intl.formatMessage({ id: 'notifications', defaultMessage: 'Notifications' })}
              >
                <a className="Topnav__link Topnav__link--light Topnav__link--action">
                  {displayBadge ? (
                    <div className="Topnav__notifications-count">{notificationsCountDisplay}</div>
                  ) : (
                    <i className="iconfont icon-remind" />
                  )}
                </a>
              </Popover>
            </BTooltip>
          </Menu.Item>
          <Menu.Item key="user" className="Topnav__item-user">
            <Link className="Topnav__user" to={`/@${username}`} onClick={Topnav.handleScrollToTop}>
              <Avatar username={username} size={36} />
            </Link>
          </Menu.Item>
          <Menu.Item key="more" className="Topnav__menu--icon">
            <Popover
              placement="bottom"
              trigger="click"
              visible={popoverVisible}
              onVisibleChange={this.handleMoreMenuVisibleChange}
              overlayStyle={{ position: 'fixed' }}
              content={
                <PopoverMenu onSelect={this.handleMoreMenuSelect}>
                  <PopoverMenuItem key="my-profile" fullScreenHidden>
                    <FormattedMessage id="my_profile" defaultMessage="My profile" />
                  </PopoverMenuItem>
                  <PopoverMenuItem key="feed" fullScreenHidden>
                    <FormattedMessage id="feed" defaultMessage="Feed" />
                  </PopoverMenuItem>
                  <PopoverMenuItem key="news" fullScreenHidden>
                    <FormattedMessage id="news" defaultMessage="News" />
                  </PopoverMenuItem>
                  <PopoverMenuItem key="objects" fullScreenHidden>
                    <FormattedMessage id="objects" defaultMessage="Objects" />
                  </PopoverMenuItem>
                  <PopoverMenuItem key="replies" fullScreenHidden>
                    <FormattedMessage id="replies" defaultMessage="Replies" />
                  </PopoverMenuItem>
                  <PopoverMenuItem key="wallet" fullScreenHidden>
                    <FormattedMessage id="wallet" defaultMessage="Wallet" />
                  </PopoverMenuItem>
                  <PopoverMenuItem key="settings">
                    <FormattedMessage id="settings" defaultMessage="Settings" />
                  </PopoverMenuItem>
                  <PopoverMenuItem key="logout">
                    <FormattedMessage id="logout" defaultMessage="Logout" />
                  </PopoverMenuItem>
                </PopoverMenu>
              }
            >
              <a className="Topnav__link">
                <Icon type="caret-down" />
                <Icon type="bars" />
              </a>
            </Popover>
          </Menu.Item>
        </Menu>
      </div>
    );
  };

  content = () => (this.props.username ? this.menuForLoggedIn() : this.menuForLoggedOut());

  handleMobileSearchButtonClick = () => {
    const { searchBarActive } = this.state;

    this.setState(
      {
        searchBarActive: !searchBarActive,
      },
      () => {
        this.searchInputRef.input.focus();
      },
    );

    if (!searchBarActive) {
      this.setState({
        dropdownOpen: false,
      });
    }
  };

  hideAutoCompleteDropdown() {
    this.setState({ searchBarActive: false }, this.props.resetSearchAutoCompete);
  }

  handleSearchForInput(event) {
    const value = replacer(event.target.value, '@');
    const pathname = this.props.searchByUser.some(item => item.account === value)
      ? `/@${value}`
      : '';

    this.props.resetSearchAutoCompete();
    this.props.history.push({
      pathname,
      state: {
        query: value,
      },
    });
    this.setState({
      searchBarValue: '',
      searchData: '',
      currentItem: '',
      searchBarActive: false,
      dropdownOpen: false,
    });
    this.handleClearSearchData();
  }

  handleSearchAllResultsClick = () => {
    const { searchData, searchBarValue } = this.state;

    this.handleOnBlur();
    let redirectUrl = '';

    switch (searchData.type) {
      case 'wobject':
        redirectUrl = `/discover-objects/${searchData.subtype}?search=${searchBarValue}`;
        break;
      case 'user':
        redirectUrl = `/discover/${searchBarValue.replace('@', '')}`;
        break;
      case 'type':
      default:
        redirectUrl = `/discover-objects?search=${searchBarValue}`;
        break;
    }

    this.props.history.push(redirectUrl);
  };

  handleAutoCompleteSearch(value) {
    this.setState({ dropdownOpen: true, searchBarValue: value });
    this.handleSearch(value);
  }

  handleSearch = value => {
    const { searchBarValue } = this.state;
    this.debouncedSearch(searchBarValue);
    if (searchBarValue === value) {
      this.debouncedSearchByUser(searchBarValue);
      this.debouncedSearchByObjectTypes(searchBarValue);
    }
  };

  handleSelectOnAutoCompleteDropdown(value, data) {
    if (data.props.marker === Topnav.markers.SELECT_BAR) {
      const optionValue = value.split('#')[1];

      if (value === `${Topnav.markers.SELECT_BAR}#All`) {
        this.setState({
          searchData: '',
          dropdownOpen: true,
          currentItem: optionValue,
        });

        return;
      }
      const nextState = {
        searchData: {
          subtype: optionValue,
          type: data.props.type,
        },
        dropdownOpen: true,
        currentItem: optionValue,
      };

      if (data.props.type === 'wobject') {
        this.setState(nextState);
        this.debouncedSearchByObject(this.state.searchBarValue, optionValue);

        return;
      }

      if (data.props.type === 'user' || data.props.type === 'type') {
        this.setState(nextState);

        return;
      }
    }
    let redirectUrl = '';

    switch (data.props.marker) {
      case Topnav.markers.USER:
        redirectUrl = `/@${value.replace('user', '')}`;
        break;
      case Topnav.markers.WOBJ:
        redirectUrl = `/object/${value.replace('wobj', '')}`;
        break;
      default:
        redirectUrl = `/discover-objects/${value.replace('type', '')}`;
    }

    this.props.history.push(redirectUrl);
    this.setState({ dropdownOpen: false });
    this.hideAutoCompleteDropdown();
  }

  handleOnChangeForAutoComplete(value, data) {
    if (!value) {
      this.setState({
        searchBarValue: '',
        searchData: '',
        currentItem: '',
      });
    }

    if (value[0] === '@') {
      this.setState({
        searchBarValue: value,
        searchData: {
          subtype: 'Users',
          type: 'user',
        },
        currentItem: 'Users',
      });
    } else if (
      data.props.marker === Topnav.markers.TYPE ||
      data.props.marker === Topnav.markers.USER ||
      data.props.marker === Topnav.markers.WOBJ
    )
      this.setState({ searchBarValue: '' });
    else if (data.props.marker !== Topnav.markers.SELECT_BAR) {
      this.setState({ searchBarValue: value, searchData: '', currentItem: 'All' });
    }
  }

  usersSearchLayout(accounts) {
    return (
      <AutoComplete.OptGroup
        key="usersTitle"
        label={this.renderTitle(
          this.props.intl.formatMessage({
            id: 'users_search_title',
            defaultMessage: 'Users',
          }),
          size(accounts),
        )}
      >
        {map(
          accounts,
          option =>
            option && (
              <AutoComplete.Option
                marker={Topnav.markers.USER}
                key={`user${option.account}`}
                value={`user${option.account}`}
                className="Topnav__search-autocomplete"
              >
                <div className="Topnav__search-content-wrap">
                  <Avatar username={option.account} size={40} />
                  <div className="Topnav__search-content">{option.account}</div>
                  <span className="Topnav__search-expertize">
                    <WeightTag weight={option.wobjects_weight} />
                    &middot;
                    <span className="Topnav__search-follow-counter">{option.followers_count}</span>
                  </span>
                </div>
                <div className="Topnav__search-content-small">
                  {option.youFollows && !option.followsYou && (
                    <FormattedMessage id="following_user" defaultMessage="following" />
                  )}
                  {!option.youFollows && option.followsYou && (
                    <FormattedMessage id="follows you" defaultMessage="follows you" />
                  )}
                  {option.youFollows && option.followsYou && (
                    <FormattedMessage id="mutual_follow" defaultMessage="mutual following" />
                  )}
                </div>
              </AutoComplete.Option>
            ),
        )}
      </AutoComplete.OptGroup>
    );
  }

  wobjectSearchLayout(wobjects) {
    return (
      <AutoComplete.OptGroup
        key="wobjectsTitle"
        label={this.renderTitle(
          this.props.intl.formatMessage({
            id: 'wobjects_search_title',
            defaultMessage: 'Objects',
          }),
          size(wobjects),
        )}
      >
        {map(wobjects, option => {
          const wobjName = getApprovedField(option, objectFields.name) || option.default_name;
          const parent = option.parent;

          return wobjName ? (
            <AutoComplete.Option
              marker={Topnav.markers.WOBJ}
              key={`wobj${wobjName}`}
              value={`wobj${option.author_permlink}`}
              className="Topnav__search-autocomplete"
            >
              <div className="Topnav__search-content-wrap">
                <ObjectAvatar item={option} size={40} />
                <div>
                  <div className="Topnav__search-content">{wobjName}</div>
                  {parent && (
                    <div className="Topnav__search-content-small">
                      {getFieldWithMaxWeight(parent, objectFields.name)}
                    </div>
                  )}
                </div>
              </div>
              <div className="Topnav__search-content-small">{option.object_type}</div>
            </AutoComplete.Option>
          ) : null;
        })}
      </AutoComplete.OptGroup>
    );
  }

  wobjectTypeSearchLayout(objectTypes) {
    return (
      <AutoComplete.OptGroup
        key="typesTitle"
        label={this.renderTitle(
          this.props.intl.formatMessage({
            id: 'wobjectType_search_title',
            defaultMessage: 'Types',
          }),
          size(objectTypes),
        )}
      >
        {map(objectTypes, option => (
          <AutoComplete.Option
            marker={Topnav.markers.TYPE}
            key={`type${option.name}`}
            value={`type${option.name}`}
            className="Topnav__search-autocomplete"
          >
            {option.name}
          </AutoComplete.Option>
        ))}
      </AutoComplete.OptGroup>
    );
  }

  prepareOptions(searchResults) {
    const { searchData } = this.state;
    const { searchByObject, searchByUser, searchByObjectType } = this.props;
    const dataSource = [];

    if (!isEmpty(searchResults)) {
      dataSource.push(this.searchSelectBar(searchResults));
    }
    if (!searchData) {
      if (!isEmpty(searchResults.wobjects))
        dataSource.push(this.wobjectSearchLayout(searchResults.wobjects.slice(0, 5)));
      if (!isEmpty(searchResults.users))
        dataSource.push(this.usersSearchLayout(searchResults.users));
      if (!isEmpty(searchResults.objectTypes))
        dataSource.push(this.wobjectTypeSearchLayout(searchResults.objectTypes));
    } else {
      if (searchData.type === 'wobject') {
        dataSource.push(this.wobjectSearchLayout(searchByObject.slice(0, 15)));
      }
      if (searchData.type === 'user') {
        dataSource.push(this.usersSearchLayout(searchByUser.slice(0, 15)));
      }
      if (searchData.type === 'type') {
        dataSource.push(this.wobjectTypeSearchLayout(searchByObjectType));
      }
    }

    return dataSource;
  }

  searchSelectBar = searchResults => {
    const options = this.getTranformSearchCountData(searchResults);

    return (
      <AutoComplete.OptGroup key={Topnav.markers.SELECT_BAR} label=" ">
        {map(options, option => (
          <AutoComplete.Option
            marker={Topnav.markers.SELECT_BAR}
            key={`type${option.name}`}
            value={`${Topnav.markers.SELECT_BAR}#${option.name}`}
            type={option.type}
            className={this.changeItemClass(option.name)}
          >
            {`${option.name}(${option.count})`}
          </AutoComplete.Option>
        ))}
      </AutoComplete.OptGroup>
    );
  };

  changeItemClass = key =>
    classNames('ant-select-dropdown-menu-item', {
      'Topnav__search-selected-active': this.state.currentItem === key,
    });

  handleOnBlur = () => {
    this.setState({
      dropdownOpen: false,
    });
  };

  handleClearSearchData = () =>
    this.setState(
      {
        searchData: '',
        searchBarValue: '',
      },
      this.props.resetSearchAutoCompete,
    );

  handleOnFocus = () => {
    if (this.state.searchBarValue) {
      this.setState({ dropdownOpen: true });
    }
  };

  renderTitle = title => <span>{title}</span>;

  render() {
    const { intl, autoCompleteSearchResults, isStartSearchAutoComplete } = this.props;
    const { searchBarActive, dropdownOpen, searchBarValue } = this.state;
    const dropdownOptions = this.prepareOptions(autoCompleteSearchResults);
    const downBar = (
      <AutoComplete.Option disabled key="all" className="Topnav__search-all-results">
        <div
          className="search-btn"
          onClick={this.handleSearchAllResultsClick}
          role="presentation"
          title={this.state.searchBarValue.length > 60 ? this.state.searchBarValue : ''}
        >
          {intl.formatMessage(
            {
              id: 'search_all_results_for',
              defaultMessage: 'Search all results for {search}',
            },
            { search: this.state.searchBarValue },
          )}
        </div>
      </AutoComplete.Option>
    );
    const formattedAutoCompleteDropdown = isEmpty(dropdownOptions)
      ? dropdownOptions
      : dropdownOptions.concat([downBar]);

    return (
      <div className="Topnav">
        <div className="topnav-layout">
          <div className={classNames('left', { 'Topnav__mobile-hidden': searchBarActive })}>
            <Link className="Topnav__brand" to="/">
              <img src="/images/icons/waivio.svg" alt="Waivio" />
            </Link>
          </div>
          <div className={classNames('center', { mobileVisible: searchBarActive })}>
            <div className="Topnav__input-container" onBlur={this.handleOnBlur}>
              <i className="iconfont icon-search" />
              <AutoComplete
                dropdownClassName="Topnav__search-dropdown-container"
                dataSource={
                  isStartSearchAutoComplete
                    ? pendingSearch(searchBarValue, intl)
                    : formattedAutoCompleteDropdown
                }
                onSearch={this.handleAutoCompleteSearch}
                onSelect={this.handleSelectOnAutoCompleteDropdown}
                onChange={this.handleOnChangeForAutoComplete}
                defaultActiveFirstOption={false}
                dropdownMatchSelectWidth={false}
                optionLabelProp="value"
                dropdownStyle={{ color: 'red' }}
                value={this.state.searchBarValue}
                open={dropdownOpen}
                onFocus={this.handleOnFocus}
              >
                <Input
                  ref={ref => {
                    this.searchInputRef = ref;
                  }}
                  onPressEnter={this.handleSearchForInput}
                  placeholder={intl.formatMessage({
                    id: 'search_placeholder',
                    defaultMessage: 'What are you looking for?',
                  })}
                  autoCapitalize="off"
                  autoCorrect="off"
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
          <div className="right">
            <button
              className={classNames('Topnav__mobile-search', {
                'Topnav__mobile-search-close': searchBarActive,
              })}
              onClick={this.handleMobileSearchButtonClick}
            >
              <i
                className={classNames('iconfont', {
                  'icon-close': searchBarActive,
                  'icon-search': !searchBarActive,
                })}
              />
            </button>
            {this.content()}
          </div>
        </div>
      </div>
    );
  }
}

export default Topnav;
