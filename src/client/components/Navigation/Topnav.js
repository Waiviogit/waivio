import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { AutoComplete, Button, Icon, Input, Menu, Modal } from 'antd';
import classNames from 'classnames';
import {
  resetSearchAutoCompete,
  searchAutoComplete,
  searchObjectsAutoCompete,
  searchObjectTypesAutoCompete,
  searchUsersAutoCompete,
} from '../../search/searchActions';
import { getUserMetadata } from '../../user/usersActions';
import { toggleModal } from '../../../investarena/redux/actions/modalsActions';
import { disconnectBroker } from '../../../investarena/redux/actions/brokersActions';
import {
  getAuthenticateduserMetaData,
  getAutoCompleteSearchResults,
  getIsAuthenticated,
  getIsLoadingNotifications,
  getNightmode,
  getNotifications,
  getScreenSize,
  getSearchObjectsResults,
  getSearchUsersResults,
  isGuestUser,
  searchObjectTypesResults,
} from '../../reducers';
import ModalBroker from '../../../investarena/components/Modals/ModalBroker';
import ModalDealConfirmation from '../../../investarena/components/Modals/ModalDealConfirmation';
import { PARSED_NOTIFICATIONS } from '../../../common/constants/notifications';
import BTooltip from '../BTooltip';
import Avatar from '../Avatar';
import PopoverMenu, { PopoverMenuItem } from '../PopoverMenu/PopoverMenu';
import PopoverContainer from '../Popover';
import Notifications from './Notifications/Notifications';
import LanguageSettings from './LanguageSettings';
import Balance from '../../../investarena/components/Header/Balance';
import {
  getIsLoadingPlatformState,
  getPlatformNameState,
} from '../../../investarena/redux/selectors/platformSelectors';
import config from '../../../investarena/configApi/config';
import { getFieldWithMaxWeight } from '../../object/wObjectHelper';
import { objectFields } from '../../../common/constants/listOfFields';
import ObjectAvatar from '../ObjectAvatar';
import TopNavigation from './TopNavigation';
import { getTopPosts } from '../../../waivioApi/ApiClient';
import ModalSignUp from './ModalSignUp/ModalSignUp';
import ModalSignIn from './ModalSignIn/ModalSignIn';
import './Topnav.less';

@injectIntl
@withRouter
@connect(
  state => ({
    autoCompleteSearchResults: getAutoCompleteSearchResults(state),
    isAuthenticated: getIsAuthenticated(state),
    searchByObject: getSearchObjectsResults(state),
    searchByUser: getSearchUsersResults(state),
    searchByObjectType: searchObjectTypesResults(state),
    notifications: getNotifications(state),
    userMetaData: getAuthenticateduserMetaData(state),
    loadingNotifications: getIsLoadingNotifications(state),
    screenSize: getScreenSize(state),
    isNightMode: getNightmode(state),
    platformName: getPlatformNameState(state),
    isLoadingPlatform: getIsLoadingPlatformState(state),
    isGuest: isGuestUser(state),
  }),
  {
    disconnectBroker,
    searchObjectsAutoCompete,
    searchAutoComplete,
    getUserMetadata,
    searchUsersAutoCompete,
    searchObjectTypesAutoCompete,
    resetSearchAutoCompete,
    toggleModal,
  },
)
class Topnav extends React.Component {
  static handleScrollToTop() {
    if (window) {
      window.scrollTo(0, 0);
    }
  }

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
    isAuthenticated: PropTypes.bool.isRequired,
    notifications: PropTypes.arrayOf(PropTypes.shape()),
    userMetaData: PropTypes.shape(),
    loadingNotifications: PropTypes.bool,
    searchAutoComplete: PropTypes.func.isRequired,
    getUserMetadata: PropTypes.func.isRequired,
    resetSearchAutoCompete: PropTypes.func.isRequired,
    platformName: PropTypes.string.isRequired,
    isLoadingPlatform: PropTypes.bool.isRequired,
    isNightMode: PropTypes.bool.isRequired,
    screenSize: PropTypes.string,
    toggleModal: PropTypes.func.isRequired,
    disconnectBroker: PropTypes.func.isRequired,
    /* passed props */
    username: PropTypes.string,
    onMenuItemClick: PropTypes.func,
    searchObjectsAutoCompete: PropTypes.func.isRequired,
    searchUsersAutoCompete: PropTypes.func.isRequired,
    searchObjectTypesAutoCompete: PropTypes.func.isRequired,
    searchByObject: PropTypes.arrayOf(PropTypes.shape()),
    searchByUser: PropTypes.arrayOf(PropTypes.shape()),
    searchByObjectType: PropTypes.arrayOf(PropTypes.shape()),
    openChat: PropTypes.func.isRequired,
    messagesCount: PropTypes.number,
    isGuest: PropTypes.bool,
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
    screenSize: 'medium',
    messagesCount: 0,
    isGuest: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      searchBarActive: false,
      popoverMobileMenuVisible: false,
      popoverProfileVisible: false,
      burgerMenuVisible: false,
      popoverBrokerVisible: false,
      searchBarValue: '',
      notificationsPopoverVisible: false,
      selectedPage: '',
      hotNewsPopoverVisible: false,
      searchData: '',
      currentItem: 'All',
      dropdownOpen: false,
      selectColor: false,
      dailyChosenPost: '',
      weeklyChosenPost: '',
      scrolling: false,
      visible: false,
    };
    this.handleMoreMenuSelect = this.handleMoreMenuSelect.bind(this);
    this.handleBrokerMenuSelect = this.handleBrokerMenuSelect.bind(this);
    this.handleMobileMenuVisibleChange = this.handleMobileMenuVisibleChange.bind(this);
    this.handleProfileMenuVisibleChange = this.handleProfileMenuVisibleChange.bind(this);
    this.handleBrokerMenuVisibleChange = this.handleBrokerMenuVisibleChange.bind(this);
    this.handleNotificationsPopoverVisibleChange = this.handleNotificationsPopoverVisibleChange.bind(
      this,
    );
    this.handleCloseNotificationsPopover = this.handleCloseNotificationsPopover.bind(this);
    this.handleSelectOnAutoCompleteDropdown = this.handleSelectOnAutoCompleteDropdown.bind(this);
    this.handleAutoCompleteSearch = this.handleAutoCompleteSearch.bind(this);
    this.handleSearchForInput = this.handleSearchForInput.bind(this);
    this.handleOnChangeForAutoComplete = this.handleOnChangeForAutoComplete.bind(this);
    this.hideAutoCompleteDropdown = this.hideAutoCompleteDropdown.bind(this);
    this.handleClickMenu = this.handleClickMenu.bind(this);
  }

  componentDidMount() {
    if (window && window.screen.width < 768) {
      window.addEventListener('scroll', this.handleScroll);
      this.prevScrollpos = window.pageYOffset;
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.searchBarValue !== this.state.searchBarValue &&
      this.state.searchBarValue !== ''
    ) {
      this.debouncedSearchByUser(this.state.searchBarValue);
      this.debouncedSearchByObjectTypes(this.state.searchBarValue);
    }
  }

  componentWillUnmount() {
    this.setState({ popoverBrokerVisible: false });
    if (window) {
      window.removeEventListener('scroll', this.handleScroll);
    }
  }

  getTranformSearchCountData = searchResults => {
    const { objectTypesCount, wobjectsCounts, usersCount } = searchResults;
    const wobjectAllCount = wobjectsCounts
      ? wobjectsCounts.reduce((accumulator, currentValue) => accumulator + currentValue.count, 0)
      : null;
    const countAllSearch = objectTypesCount + usersCount + wobjectAllCount;
    const countArr = [{ name: 'All', count: countAllSearch }];
    if (!_.isEmpty(wobjectsCounts)) {
      _.forEach(wobjectsCounts, current => {
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

  static markers = {
    USER: 'user',
    WOBJ: 'wobj',
    TYPE: 'type',
    SELECT_BAR: 'searchSelectBar',
  };

  handleMoreMenuSelect(key) {
    this.setState({ popoverProfileVisible: false }, () => {
      this.props.onMenuItemClick(key);
    });
  }

  handleBurgerMenuSelect = key =>
    this.setState({ burgerMenuVisible: false }, () => {
      this.props.onMenuItemClick(key);
    });

  handleBrokerMenuSelect(key) {
    switch (key) {
      case 'deposit':
        this.setState({ popoverBrokerVisible: false, isModalDeposit: true });
        break;
      case 'openDeals':
        this.setState({ popoverBrokerVisible: false }, () => {
          this.props.history.push('/deals/open');
        });
        break;
      case 'closedDeals':
        this.setState({ popoverBrokerVisible: false }, () => {
          this.props.history.push('/deals/closed');
        });
        break;
      case 'broker-disconnect':
        this.setState({ popoverBrokerVisible: false }, () => {
          this.props.disconnectBroker('broker');
        });
        break;
      default:
        break;
    }
  }

  handleMobileMenuVisibleChange() {
    this.setState({ popoverMobileMenuVisible: !this.state.popoverMobileMenuVisible });
  }

  handleProfileMenuVisibleChange(visible) {
    this.setState({ popoverProfileVisible: visible });
  }

  handleBurgerMenuVisibleChange = visible => this.setState({ burgerMenuVisible: visible });

  handleBrokerMenuVisibleChange(visible) {
    this.setState({ popoverBrokerVisible: visible });
  }

  handleHotNewsPopoverVisibleChange = async () => {
    this.setState(prevState => ({ hotNewsPopoverVisible: !prevState.hotNewsPopoverVisible }));
    if (_.isEmpty(this.state.dailyChosenPost)) {
      getTopPosts()
        .then(data => {
          if (!_.isEmpty(data.daily_chosen_post) && !_.isEmpty(data.weekly_chosen_post)) {
            this.setState({
              dailyChosenPost: data.daily_chosen_post,
              weeklyChosenPost: data.weekly_chosen_post,
            });
          }
        })
        .catch(error => console.error(error));
    }
  };

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

  handleClickMenu = e => this.setState({ selectedPage: e.key });

  handleScroll = () => {
    const currentScrollPos = window && window.pageYOffset;
    const visible = this.prevScrollpos < currentScrollPos;

    this.prevScrollpos = currentScrollPos;

    if (this.state.visible !== visible) {
      this.setState({ visible });
    }
  };

  menuForLoggedOut = () => {
    const { location } = this.props;
    const { searchBarActive } = this.state;
    const next = location.pathname.length > 1 ? location.pathname : '';

    return (
      <div
        className={classNames('Topnav__menu-container Topnav__menu-logedout', {
          'Topnav__mobile-hidden': searchBarActive,
        })}
      >
        <Menu className="Topnav__menu" mode="horizontal">
          <Menu.Item className="Topnav__menu-item Topnav__menu-item--logedout" key="signup">
            <ModalSignUp isButton={false} />
          </Menu.Item>
          <Menu.Item
            className="Topnav__menu-item Topnav__menu-item--logedout"
            key="divider"
            disabled
          >
            |
          </Menu.Item>
          <Menu.Item className="Topnav__menu-item Topnav__menu-item--logedout" key="login">
            <ModalSignIn next={next} />
          </Menu.Item>
          <Menu.Item className="Topnav__menu-item Topnav__menu-item--logedout" key="language">
            <LanguageSettings />
          </Menu.Item>
        </Menu>
      </div>
    );
  };

  burgerMenu = logStatus => {
    const isLoggedOut = logStatus === 'loggedOut';
    const { isGuest } = this.props;
    return (
      <PopoverContainer
        placement="bottom"
        trigger="click"
        visible={this.state.burgerMenuVisible}
        onVisibleChange={this.handleBurgerMenuVisibleChange}
        overlayStyle={{ position: 'fixed' }}
        content={
          <PopoverMenu onSelect={this.handleBurgerMenuSelect}>
            <PopoverMenuItem key="myFeed" fullScreenHidden hideItem={isLoggedOut}>
              <FormattedMessage id="my_feed" defaultMessage="My feed" />
            </PopoverMenuItem>
            <PopoverMenuItem key="discover-objects" fullScreenHidden>
              <FormattedMessage id="discover" defaultMessage="Discover" />
            </PopoverMenuItem>
            <PopoverMenuItem key="quick_forecast" fullScreenHidden>
              <FormattedMessage id="quick_forecast" defaultMessage="Forecast" />
            </PopoverMenuItem>
            {!isGuest && (
              <PopoverMenuItem key="activity" mobileScreenHidden>
                <FormattedMessage id="activity" defaultMessage="Activity" />
              </PopoverMenuItem>
            )}
            <PopoverMenuItem key="bookmarks" mobileScreenHidden>
              <FormattedMessage id="bookmarks" defaultMessage="Bookmarks" />
            </PopoverMenuItem>
            <PopoverMenuItem key="drafts">
              <FormattedMessage id="drafts" defaultMessage="Drafts" />
            </PopoverMenuItem>
            <PopoverMenuItem key="settings">
              <FormattedMessage id="settings" defaultMessage="Settings" />
            </PopoverMenuItem>
            <PopoverMenuItem key="replies" fullScreenHidden>
              <FormattedMessage id="replies" defaultMessage="Replies" />
            </PopoverMenuItem>
            <PopoverMenuItem key="wallet">
              <FormattedMessage id="wallet" defaultMessage="Wallet" />
            </PopoverMenuItem>
            <PopoverMenuItem key="about" fullScreenHidden>
              <FormattedMessage id="about" defaultMessage="About" />
            </PopoverMenuItem>
            <PopoverMenuItem key="logout">
              <FormattedMessage id="logout" defaultMessage="Logout" />
            </PopoverMenuItem>
          </PopoverMenu>
        }
      >
        <a className="Topnav__link Topnav__link--menu">
          <Icon type="menu" className="iconfont icon-menu" />
        </a>
      </PopoverContainer>
    );
  };

  hotNews = () => {
    const { intl } = this.props;
    const { hotNewsPopoverVisible, dailyChosenPost, weeklyChosenPost } = this.state;
    return (
      <BTooltip
        placement="bottom"
        title={intl.formatMessage({ id: 'hot_news', defaultMessage: 'Hot news' })}
        overlayClassName="Topnav__notifications-tooltip"
        mouseEnterDelay={1}
      >
        <PopoverContainer
          placement="bottomRight"
          trigger="click"
          content={
            <div className="Topnav__hot-news">
              {!_.isEmpty(dailyChosenPost) && (
                <Link
                  to={`/@${dailyChosenPost.author}/${dailyChosenPost.permlink}`}
                  className="Topnav__hot-news-item"
                  onClick={this.handleHotNewsPopoverVisibleChange}
                >
                  {dailyChosenPost.title}
                </Link>
              )}
              {!_.isEmpty(weeklyChosenPost) && (
                <Link
                  to={`/@${weeklyChosenPost.author}/${weeklyChosenPost.permlink}`}
                  className="Topnav__hot-news-item"
                  onClick={this.handleHotNewsPopoverVisibleChange}
                >
                  {weeklyChosenPost.title}
                </Link>
              )}
              <Link
                to="/economical-calendar"
                className="Topnav__hot-news-item"
                onClick={this.handleHotNewsPopoverVisibleChange}
              >
                Economical calendar
              </Link>
            </div>
          }
          visible={hotNewsPopoverVisible}
          onVisibleChange={this.handleHotNewsPopoverVisibleChange}
          overlayClassName="Notifications__popover-overlay"
          title={intl.formatMessage({ id: 'hot_news', defaultMessage: 'Hot news' })}
        >
          <Icon type="fire" className="iconfont fire-icon" />
        </PopoverContainer>
      </BTooltip>
    );
  };

  menuForLoggedIn = () => {
    const {
      intl,
      username,
      notifications,
      userMetaData,
      loadingNotifications,
      platformName,
      isLoadingPlatform,
    } = this.props;
    const { searchBarActive, notificationsPopoverVisible, popoverBrokerVisible } = this.state;
    const lastSeenTimestamp = _.get(userMetaData, 'notifications_last_timestamp');
    const notificationsCount = _.isUndefined(lastSeenTimestamp)
      ? _.size(notifications)
      : _.size(
          _.filter(
            notifications,
            notification =>
              lastSeenTimestamp < notification.timestamp &&
              _.includes(PARSED_NOTIFICATIONS, notification.type),
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
        <ModalBroker />
        <Menu selectedKeys={[]} className="Topnav__menu" mode="horizontal">
          <Menu.Item className="Topnav__menu-item Topnav__menu-item--broker" key="broker">
            <React.Fragment>
              {platformName !== 'widgets' && !isLoadingPlatform ? (
                <PopoverContainer
                  placement="bottom"
                  trigger="click"
                  visible={popoverBrokerVisible}
                  onVisibleChange={this.handleOnClickBrokerIcon}
                  overlayStyle={{ position: 'fixed' }}
                  content={
                    <div>
                      <PopoverMenu onSelect={this.handleBrokerMenuSelect}>
                        <PopoverMenuItem key="deposit">
                          <FormattedMessage
                            id="headerAuthorized.deposit"
                            defaultMessage="Deposit"
                          />
                        </PopoverMenuItem>
                        <PopoverMenuItem key="openDeals">
                          <FormattedMessage
                            id="headerAuthorized.openDeals"
                            defaultMessage="Open deals"
                          />
                        </PopoverMenuItem>
                        <PopoverMenuItem key="closedDeals">
                          <FormattedMessage
                            id="headerAuthorized.closedDeals"
                            defaultMessage="Closed deals"
                          />
                        </PopoverMenuItem>
                        <PopoverMenuItem key="broker-disconnect">
                          <FormattedMessage
                            id="disconnect_broker"
                            defaultMessage="Disconnect Broker"
                          />
                        </PopoverMenuItem>
                      </PopoverMenu>
                    </div>
                  }
                >
                  <img
                    className="Topnav__icon-broker"
                    role="presentation"
                    title={platformName}
                    src={`/images/investarena/${platformName}.png`}
                    alt="broker"
                  />
                </PopoverContainer>
              ) : (
                <div
                  className="Topnav__item-broker"
                  onClick={this.handleOnClickBrokerIcon}
                  role="presentation"
                >
                  <img src="/images/icons/broker.svg" alt="broker" />
                </div>
              )}
            </React.Fragment>
          </Menu.Item>
          <Menu.Item className="Topnav__menu-item" key="hot">
            {this.hotNews()}
          </Menu.Item>
          <Menu.Item className="Topnav__menu-item" key="write">
            <BTooltip
              placement="bottom"
              title={intl.formatMessage({ id: 'write_post', defaultMessage: 'Write post' })}
              overlayClassName="Topnav__notifications-tooltip"
              mouseEnterDelay={1}
            >
              <Link to="/editor" className="Topnav__link Topnav__link--action">
                <i className="iconfont icon-write" />
              </Link>
            </BTooltip>
          </Menu.Item>

          <Menu.Item className="Topnav__menu-item" key="notifications">
            <BTooltip
              placement="bottom"
              title={intl.formatMessage({ id: 'notifications', defaultMessage: 'Notifications' })}
              overlayClassName="Topnav__notifications-tooltip"
              mouseEnterDelay={1}
            >
              <PopoverContainer
                placement="bottomRight"
                trigger="click"
                content={
                  <Notifications
                    notifications={notifications}
                    onNotificationClick={this.handleCloseNotificationsPopover}
                    st-card__chart
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
              </PopoverContainer>
            </BTooltip>
          </Menu.Item>
          <Menu.Item className="Topnav__menu-item" key="user">
            <Link className="Topnav__user" to={`/@${username}`} onClick={Topnav.handleScrollToTop}>
              <Avatar username={username} size={36} />
            </Link>
          </Menu.Item>
          <Menu.Item className="Topnav__menu-item Topnav__menu-item--burger" key="more">
            {this.burgerMenu()}
          </Menu.Item>
        </Menu>
      </div>
    );
  };

  content = () => (this.props.username ? this.menuForLoggedIn() : this.menuForLoggedOut());

  handleMobileSearchButtonClick = () => {
    const { searchBarActive } = this.state;
    this.setState({ searchBarActive: !searchBarActive }, () => {
      this.searchInputRef.input.focus();
    });
  };

  hideAutoCompleteDropdown() {
    this.setState({ searchBarActive: false }, this.props.resetSearchAutoCompete);
  }

  handleSearchForInput(event) {
    const value = event.target.value;
    this.hideAutoCompleteDropdown();
    this.props.history.push({
      pathname: '/discover-objects',
      search: `search=${value}`,
      state: {
        query: value,
      },
    });
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
        redirectUrl = `/search?q=${searchBarValue}`;
        break;
      case 'type':
      default:
        redirectUrl = `/discover-objects?search=${searchBarValue}`;
        break;
    }
    this.props.history.push(redirectUrl);
  };

  debouncedSearch = _.debounce(value => this.props.searchAutoComplete(value, 3, 15), 300);
  debouncedSearchByObject = _.debounce((searchString, objType) =>
    this.props.searchObjectsAutoCompete(searchString, objType),
  );
  debouncedSearchByUser = _.debounce(searchString =>
    this.props.searchUsersAutoCompete(searchString),
  );
  debouncedSearchByObjectTypes = _.debounce(searchString =>
    this.props.searchObjectTypesAutoCompete(searchString),
  );

  handleAutoCompleteSearch(value) {
    this.debouncedSearch(value);
    this.setState({ dropdownOpen: true });
  }

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
    if (
      data.props.marker === Topnav.markers.TYPE ||
      data.props.marker === Topnav.markers.USER ||
      data.props.marker === Topnav.markers.WOBJ
    )
      this.setState({ searchBarValue: '' });
    else if (data.props.marker !== Topnav.markers.SELECT_BAR) {
      this.setState({ searchBarValue: value, searchData: '', currentItem: 'All' });
    }
  }

  handleOnClickBrokerIcon = value => {
    if (this.props.platformName !== 'widgets') {
      this.handleBrokerMenuVisibleChange(value);
    } else {
      this.toggleModalBroker();
    }
  };

  usersSearchLayout(accounts) {
    return (
      <AutoComplete.OptGroup
        key="usersTitle"
        label={this.renderTitle(
          this.props.intl.formatMessage({
            id: 'users_search_title',
            defaultMessage: 'Users',
          }),
          _.size(accounts),
        )}
      >
        {_.map(accounts, option => (
          <AutoComplete.Option
            marker={Topnav.markers.USER}
            key={`user${option.account}`}
            value={`user${option.account}`}
            className="Topnav__search-autocomplete"
          >
            <div className="Topnav__search-content-wrap">
              <Avatar username={option.account} size={40} />
              <div className="Topnav__search-content">{option.account}</div>
            </div>
          </AutoComplete.Option>
        ))}
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
          _.size(wobjects),
        )}
      >
        {_.map(wobjects, option => {
          const wobjName = getFieldWithMaxWeight(option, objectFields.name);
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
                      ({getFieldWithMaxWeight(parent, objectFields.name)})
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
          _.size(objectTypes),
        )}
      >
        {_.map(objectTypes, option => (
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
    if (!_.isEmpty(searchResults)) {
      dataSource.push(this.searchSelectBar(searchResults));
    }
    if (!searchData) {
      if (!_.isEmpty(searchResults.wobjects))
        dataSource.push(this.wobjectSearchLayout(searchResults.wobjects.slice(0, 5)));
      if (!_.isEmpty(searchResults.users))
        dataSource.push(this.usersSearchLayout(searchResults.users));
      if (!_.isEmpty(searchResults.objectTypes))
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
        {_.map(options, option => (
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

  toggleModalBroker = () => {
    this.props.toggleModal('broker');
  };

  toggleModalDeposit = () => {
    this.setState({ isModalDeposit: !this.state.isModalDeposit });
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

  handleOnFocus = () => this.setState({ dropdownOpen: true });

  scrollHandler = () => {
    this.setState({ scrolling: !this.state.scrolling });
  };

  renderTitle = title => <span>{title}</span>;

  render() {
    const {
      intl,
      isAuthenticated,
      autoCompleteSearchResults,
      screenSize,
      platformName,
      isLoadingPlatform,
      isNightMode,
      openChat,
      messagesCount,
    } = this.props;
    const { searchBarActive, isModalDeposit, dropdownOpen, popoverBrokerVisible } = this.state;
    const isMobile = screenSize === 'xsmall' || screenSize === 'small';
    const brandLogoPath = isMobile ? '/images/icons/icon-72x72.png' : '/images/logo-brand.png';
    const dropdownOptions = this.prepareOptions(autoCompleteSearchResults);
    const downBar = (
      <AutoComplete.Option disabled key="all" className="Topnav__search-all-results">
        {/*<div className="search-btn" onClick={this.handleSearchAllResultsClick} role="presentation">*/}
        {/*  {intl.formatMessage(*/}
        {/*    {*/}
        {/*      id: 'search_all_results_for',*/}
        {/*      defaultMessage: 'Search all results for {search}',*/}
        {/*    },*/}
        {/*    { search: this.state.searchBarValue },*/}
        {/*  )}*/}
        {/*</div>*/}
      </AutoComplete.Option>
    );
    const formattedAutoCompleteDropdown = _.isEmpty(dropdownOptions)
      ? dropdownOptions
      : dropdownOptions.concat([downBar]);
    return (
      <div
        className={classNames('Topnav', {
          'no-navbroker': platformName === 'widgets',
          'top-hidden': this.state.visible && isMobile,
        })}
      >
        <ModalDealConfirmation />
        <div className="topnav-layout">
          <div className={classNames('left', { 'Topnav__mobile-hidden': searchBarActive })}>
            <Link to="/" className="Topnav__brand">
              {isMobile ? (
                'investarena'
              ) : (
                <img alt="InvestArena" src={brandLogoPath} className="Topnav__brand-icon" />
              )}
            </Link>
          </div>
          <div
            className={classNames(
              'center',
              'center-menu',
              { mobileVisible: searchBarActive },
              { 'center-menu--logedout': !isAuthenticated },
            )}
          >
            <div className="Topnav__input-container" onBlur={this.handleOnBlur}>
              <i className="iconfont icon-search" />
              <AutoComplete
                dropdownClassName="Topnav__search-dropdown-container"
                dataSource={formattedAutoCompleteDropdown}
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
            <div className="Topnav__horizontal-menu">
              {!isMobile && (
                <TopNavigation
                  authenticated={isAuthenticated}
                  location={this.props.history.location}
                  isMobile={isMobile || screenSize === 'medium'}
                />
              )}
            </div>
          </div>
          <div
            className={classNames('Topnav__right-top', {
              'Topnav__right-top--logedout': !isAuthenticated,
            })}
          >
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
            {this.props.username && (
              <div className="Topnav__chat" key="more">
                {!messagesCount ? (
                  <Icon type="message" className="icon-chat" onClick={openChat} />
                ) : (
                  <div className="Topnav__chat-button" onClick={openChat} role="presentation">
                    {messagesCount > 99 ? '99+' : messagesCount}
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="Topnav__right-bottom">{this.content()}</div>

          {platformName !== 'widgets' && !isLoadingPlatform ? (
            <div className="Topnav__broker">
              <div className="Topnav__broker-wrap">
                <div className="Topnav__balance-wrap Topnav__balance-wrap--left">
                  <div className="Topnav__balance-text">
                    {intl.formatMessage({
                      id: 'headerAuthorized.p&l',
                      defaultMessage: 'P&L deals',
                    })}
                    :
                  </div>
                  <div className="Topnav__balance-amount">
                    <Balance balanceType="unrealizedPnl" />
                  </div>
                </div>
                <div className="Topnav__balance-wrap Topnav__balance-wrap--right">
                  <div className="Topnav__balance-text">
                    {intl.formatMessage({
                      id: 'headerAuthorized.balance',
                      defaultMessage: 'Balance',
                    })}
                    :
                  </div>
                  <div className="Topnav__balance-amount">
                    <Balance balanceType="balance" />
                  </div>
                </div>
                <Modal
                  title={intl.formatMessage({
                    id: 'headerAuthorized.deposit',
                    defaultMessage: 'Deposit',
                  })}
                  footer={null}
                  visible={isModalDeposit}
                  onCancel={this.toggleModalDeposit}
                  wrapClassName="fullscreen-mode"
                  destroyOnClose
                >
                  <div className="fs-content-wrapper">
                    <iframe
                      title="depositFrame"
                      className="fs-embedded-content"
                      src={`${
                        config[process.env.NODE_ENV].platformDepositUrl[this.props.platformName]
                      }?${isNightMode ? 'style=wp&' : ''}mode=popup&lang=en#deposit`}
                    />
                  </div>
                </Modal>
                {!isMobile && (
                  <React.Fragment>
                    <img
                      role="presentation"
                      title={platformName}
                      onClick={this.toggleModalBroker}
                      className="st-header__image"
                      src={`/images/investarena/${platformName}.png`}
                      alt="broker"
                    />
                    <PopoverContainer
                      placement="bottom"
                      trigger="click"
                      visible={popoverBrokerVisible}
                      onVisibleChange={this.handleBrokerMenuVisibleChange}
                      overlayStyle={{ position: 'fixed' }}
                      content={
                        <div>
                          <PopoverMenu onSelect={this.handleBrokerMenuSelect}>
                            <PopoverMenuItem key="deposit">
                              <FormattedMessage
                                id="headerAuthorized.deposit"
                                defaultMessage="Deposit"
                              />
                            </PopoverMenuItem>
                            <PopoverMenuItem key="openDeals">
                              <FormattedMessage
                                id="headerAuthorized.openDeals"
                                defaultMessage="Open deals"
                              />
                            </PopoverMenuItem>
                            <PopoverMenuItem key="closedDeals">
                              <FormattedMessage
                                id="headerAuthorized.closedDeals"
                                defaultMessage="Closed deals"
                              />
                            </PopoverMenuItem>
                            <PopoverMenuItem key="broker-disconnect">
                              <FormattedMessage
                                id="disconnect_broker"
                                defaultMessage="Disconnect Broker"
                              />
                            </PopoverMenuItem>
                          </PopoverMenu>
                        </div>
                      }
                    >
                      <a className="Topnav__link dropdown-icon">
                        <Icon type="iconfont caret-down" />
                      </a>
                    </PopoverContainer>
                  </React.Fragment>
                )}
              </div>
            </div>
          ) : (
            this.props.username &&
            !isMobile && (
              <div className="Topnav__broker">
                <div className="st-header-broker-balance-pl-wrap">
                  <Button type="primary" onClick={this.toggleModalBroker}>
                    {intl.formatMessage({
                      id: 'headerAuthorized.connectToBroker',
                      defaultMessage: 'Connect to broker',
                    })}
                  </Button>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    );
  }
}

export default Topnav;
