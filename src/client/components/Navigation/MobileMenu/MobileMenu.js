import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { get, isUndefined, size, filter, includes } from 'lodash';
import { FormattedMessage, injectIntl } from 'react-intl';
import { AutoComplete, Button, Input, Menu } from 'antd';
import classNames from 'classnames';
import ModalBroker from '../../../../investarena/components/Modals/ModalBroker';
import BTooltip from '../../BTooltip';
import PopoverContainer from '../../Popover';
import Notifications from '../Notifications/Notifications';
import { PARSED_NOTIFICATIONS } from '../../../../common/constants/notifications';
import { disconnectBroker } from '../../../../investarena/redux/actions/brokersActions';
import { logout } from '../../../auth/authActions';
import { getIsBeaxyUser } from '../../../user/usersHelper';
import BrokerBalance from '../BrokerBalance/BrokerBalance';
import Avatar from '../../Avatar';
import './MobileMenu.less';
import SignUp from '../../Sidebar/SignUp';
import HotNews from '../HotNews';
import { getModalIsOpenState } from '../../../../investarena/redux/selectors/modalsSelectors';
import {
  getIsLoadingPlatformState,
  getPlatformNameState,
} from '../../../../investarena/redux/selectors/platformSelectors';

const MobileMenu = props => {
  const {
    searchOptions,
    onSearch,
    onSelect,
    onChange,
    onFocus,
    dropdownOpen,
    intl,
    searchBarValue,
    onSearchPressEnter,
    onBlur,
    handleScrollToTop,
    username,
    notifications,
    userMetaData,
    loadingNotifications,
    isBrokerModalOpen,
    notificationsPopoverVisible,
    handleCloseNotificationsPopover,
    getUserMetadata,
    handleNotificationsPopoverVisibleChange,
    onLogout,
    disconnectPlatform,
    platformName,
    mobileMenuToggler,
    toggleModal,
  } = props;

  const mobileRef = useRef(null);

  useEffect(() => {
    handleCloseNotificationsPopover();
  }, []);

  const isBeaxyUser = getIsBeaxyUser(username);

  const onLogoutHandler = () => {
    onLogout();
    mobileMenuToggler();
  };

  const handleMenuItemHide = () => {
    mobileMenuToggler();
  };

  const toggleModalBroker = () => {
    toggleModal('broker');
  };

  const buttonsMenuContainer = () => {
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
      <div className="Topnav__menu-container">
        <Menu selectedKeys={[]} className="Topnav__menu" mode="horizontal">
          <Menu.Item className="Topnav__menu-item" key="write" onClick={handleMenuItemHide}>
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
          <Menu.Item className="Topnav__menu-item" onClick={handleMenuItemHide}>
            <Link to="/" className="Topnav__link Topnav__link--light Topnav__link--action">
              <img className="feed" alt="feed" src={'/images/icons/ia-icon-feed.svg'} />
            </Link>
          </Menu.Item>
          <Menu.Item className="Topnav__menu-item" key="hot">
            <HotNews isMobile />
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
                    onNotificationClick={handleCloseNotificationsPopover}
                    st-card__chart
                    currentAuthUsername={username}
                    lastSeenTimestamp={lastSeenTimestamp}
                    loadingNotifications={loadingNotifications}
                    getUpdatedUserMetadata={getUserMetadata}
                  />
                }
                visible={notificationsPopoverVisible}
                onVisibleChange={handleNotificationsPopoverVisibleChange}
                overlayClassName="Notifications__popover-overlay"
                title={intl.formatMessage({ id: 'notifications', defaultMessage: 'Notifications' })}
              >
                <a className="Topnav__link Topnav__link--light Topnav__link--action">
                  {displayBadge ? (
                    <div className="Topnav__notifications-count">{notificationsCountDisplay}</div>
                  ) : (
                    <img alt="notifications" src={'/images/icons/ia-icon-bell.svg'} />
                  )}
                </a>
              </PopoverContainer>
            </BTooltip>
          </Menu.Item>
        </Menu>
      </div>
    );
  };

  const loggedInMenuContainer = (
    <React.Fragment>
      <Link to="/my_feed" className="MenuContainer__link" onClick={mobileMenuToggler}>
        <FormattedMessage id="my_feed" defaultMessage="My feed" />
      </Link>
      <Link to="/discover" className="MenuContainer__link" onClick={mobileMenuToggler}>
        <FormattedMessage id="discover" defaultMessage="Discover" />
      </Link>
      <Link to="/drafts" className="MenuContainer__link" onClick={mobileMenuToggler}>
        <FormattedMessage id="drafts" defaultMessage="Drafts" />
      </Link>
      <Link to="/settings" className="MenuContainer__link" onClick={mobileMenuToggler}>
        <FormattedMessage id="settings" defaultMessage="Settings" />
      </Link>
      <Link to="/replies" className="MenuContainer__link" onClick={mobileMenuToggler}>
        <FormattedMessage id="replies" defaultMessage="Replies" />
      </Link>
      <Link to="/wallet" className="MenuContainer__link" onClick={mobileMenuToggler}>
        <FormattedMessage id="wallet" defaultMessage="Wallet" />
      </Link>
      <Link to="/about" className="MenuContainer__link" onClick={mobileMenuToggler}>
        <FormattedMessage id="about" defaultMessage="About" />
      </Link>
      <div className="MenuContainer__link" onClick={onLogoutHandler} role="presentation">
        <FormattedMessage id="logout" defaultMessage="Logout" />
      </div>
    </React.Fragment>
  );

  const loggedOutMenuContainer = (
    <React.Fragment>
      <Link to="/" className="MenuContainer__link" onClick={mobileMenuToggler}>
        <FormattedMessage id="home" defaultMessage="Home" />
      </Link>
      <Link to="/discover" className="MenuContainer__link" onClick={mobileMenuToggler}>
        <FormattedMessage id="discover" defaultMessage="Discover" />
      </Link>
      <Link to="/about" className="MenuContainer__link" onClick={mobileMenuToggler}>
        <FormattedMessage id="about" defaultMessage="About" />
      </Link>
    </React.Fragment>
  );

  return (
    <div className="MobileMenu" ref={mobileRef}>
      <i className="MobileMenu__mask" onClick={mobileMenuToggler} role="presentation" />
      <div className="MobileMenu__wrapper">
        {username && (
          <div className="userData">
            <ModalBroker />
            <span className="userData__broker-balance">
              {platformName === 'beaxy' && <BrokerBalance isMobile />}
            </span>
            <span className="userData__user">
              <Link to={`/@${username}`} onClick={handleScrollToTop}>
                <Avatar username={username} size={50} />
              </Link>
            </span>
          </div>
        )}
        <div className="MobileMenu__input-container" onBlur={onBlur}>
          <AutoComplete
            dropdownClassName={classNames('Topnav__search-dropdown-container', {
              'logged-out': !username,
            })}
            dataSource={searchOptions}
            onSearch={onSearch}
            onSelect={onSelect}
            onChange={onChange}
            defaultActiveFirstOption={false}
            dropdownMatchSelectWidth={false}
            optionLabelProp="value"
            dropdownStyle={{ color: 'red' }}
            value={searchBarValue}
            open={dropdownOpen}
            onFocus={onFocus}
          >
            <Input
              onPressEnter={onSearchPressEnter}
              placeholder={intl.formatMessage({
                id: 'search_placeholder',
                defaultMessage: 'What are you looking for?',
              })}
              autoCapitalize="off"
              autoCorrect="off"
            />
          </AutoComplete>
          <i className="iconfont icon-search" />
        </div>
        {username ? buttonsMenuContainer() : <SignUp />}
        <div className="MenuContainer">
          {username ? loggedInMenuContainer : loggedOutMenuContainer}
        </div>
        {!isBeaxyUser && platformName === 'widgets' ? (
          <div className="MobileMenu__disconnect-broker">
            <Button type="primary" onClick={toggleModalBroker}>
              {intl.formatMessage({
                id: 'headerAuthorized.connectToBeaxy',
                defaultMessage: 'Connect to beaxy',
              })}
            </Button>
          </div>
        ) : (
          <div className="MobileMenu__disconnect-broker">
            <Button onClick={disconnectPlatform}>
              <FormattedMessage id="disconnect_broker" defaultMessage="Disconnect broker" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

MobileMenu.propTypes = {
  searchOptions: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onFocus: PropTypes.func.isRequired,
  dropdownOpen: PropTypes.bool,
  intl: PropTypes.shape().isRequired,
  searchBarValue: PropTypes.string,
  onSearchPressEnter: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  handleScrollToTop: PropTypes.func.isRequired,
  username: PropTypes.string,
  notifications: PropTypes.arrayOf(PropTypes.shape()),
  userMetaData: PropTypes.shape(),
  loadingNotifications: PropTypes.bool,
  notificationsPopoverVisible: PropTypes.bool,
  handleCloseNotificationsPopover: PropTypes.func.isRequired,
  getUserMetadata: PropTypes.func.isRequired,
  handleNotificationsPopoverVisibleChange: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
  disconnectPlatform: PropTypes.func.isRequired,
  platformName: PropTypes.string.isRequired,
  mobileMenuToggler: PropTypes.func.isRequired,
  toggleModal: PropTypes.func.isRequired,
};

MobileMenu.defaultProps = {
  username: '',
  dropdownOpen: false,
  searchBarValue: '',
  notifications: [],
  userMetaData: {},
  loadingNotifications: false,
  notificationsPopoverVisible: false,
};

const mapStateToProps = state => ({
  isBrokerModalOpen: getModalIsOpenState(state, 'broker'),
});

const mapDispatchToProps = dispatch => ({
  onLogout: () => dispatch(logout()),
  disconnectPlatform: () => dispatch(disconnectBroker()),
});

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(MobileMenu));
