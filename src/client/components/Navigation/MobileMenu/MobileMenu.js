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
    hotNews,
    notificationsPopoverVisible,
    handleCloseNotificationsPopover,
    getUserMetadata,
    handleNotificationsPopoverVisibleChange,
    onLogout,
    disconnectPlatform,
    platformName,
    mobileMenuToggler,
  } = props;

  const mobileRef = useRef(null);

  const handleHideMenu = event => {
    if (mobileRef.current && !mobileRef.current.contains(event.target)) {
      mobileMenuToggler();
      document.removeEventListener('click', handleHideMenu, true);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleHideMenu, true);
  }, []);

  const isBeaxyUser = getIsBeaxyUser(username);

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
        <ModalBroker />
        <Menu selectedKeys={[]} className="Topnav__menu" mode="horizontal">
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
          <Menu.Item className="Topnav__menu-item" key="hot">
            <a>{hotNews()}</a>
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
                    <i className="iconfont icon-remind" />
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
      <Link to="/my_feed" className="MenuContainer__link">
        <FormattedMessage id="my_feed" defaultMessage="My feed" />
      </Link>
      <Link to="/discover" className="MenuContainer__link">
        <FormattedMessage id="discover" defaultMessage="Discover" />
      </Link>
      <Link to="/drafts" className="MenuContainer__link">
        <FormattedMessage id="drafts" defaultMessage="Drafts" />
      </Link>
      <Link to="/settings" className="MenuContainer__link">
        <FormattedMessage id="settings" defaultMessage="Settings" />
      </Link>
      <Link to="/replies" className="MenuContainer__link">
        <FormattedMessage id="replies" defaultMessage="Replies" />
      </Link>
      <Link to="/wallet" className="MenuContainer__link">
        <FormattedMessage id="wallet" defaultMessage="Wallet" />
      </Link>
      <Link to="/about" className="MenuContainer__link">
        <FormattedMessage id="about" defaultMessage="About" />
      </Link>
      <div className="MenuContainer__link" onClick={onLogout} role="presentation">
        <FormattedMessage id="logout" defaultMessage="Logout" />
      </div>
    </React.Fragment>
  );

  const loggedOutMenuContainer = (
    <React.Fragment>
      <Link to="/" className="MenuContainer__link">
        <FormattedMessage id="home" defaultMessage="Home" />
      </Link>
      <Link to="/discover" className="MenuContainer__link">
        <FormattedMessage id="discover" defaultMessage="Discover" />
      </Link>
      <Link to="/about" className="MenuContainer__link">
        <FormattedMessage id="about" defaultMessage="About" />
      </Link>
    </React.Fragment>
  );

  return (
    <div className="MobileMenu" ref={mobileRef}>
      <div className="MobileMenu__wrapper">
        {username && (
          <div className="UserData">
            <span className="UserData__broker-balance">
              <BrokerBalance isMobile />
            </span>
            <span className="UserData__user">
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
        <div>{buttonsMenuContainer()}</div>
        <div className="MenuContainer">
          {username ? loggedInMenuContainer : loggedOutMenuContainer}
        </div>
        {!isBeaxyUser && platformName === 'beaxy' && (
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
  hotNews: PropTypes.func.isRequired,
  notificationsPopoverVisible: PropTypes.bool,
  handleCloseNotificationsPopover: PropTypes.func.isRequired,
  getUserMetadata: PropTypes.func.isRequired,
  handleNotificationsPopoverVisibleChange: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
  disconnectPlatform: PropTypes.func.isRequired,
  platformName: PropTypes.string.isRequired,
  mobileMenuToggler: PropTypes.func.isRequired,
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

const mapDispatchToProps = dispatch => ({
  onLogout: () => dispatch(logout()),
  disconnectPlatform: () => dispatch(disconnectBroker()),
});

export default injectIntl(connect(null, mapDispatchToProps)(MobileMenu));
