import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { filter, get, includes, isUndefined, size } from 'lodash';
import { Icon, Menu } from 'antd';
import { Link } from 'react-router-dom';
import { FormattedMessage, injectIntl } from 'react-intl';
import { withRouter } from 'react-router';

import BTooltip from '../BTooltip';
import Popover from '../Popover';
import Notifications from '../Navigation/Notifications/Notifications';
import Avatar from '../Avatar';
import PopoverMenu, { PopoverMenuItem } from '../PopoverMenu/PopoverMenu';
import { PARSED_NOTIFICATIONS } from '../../../common/constants/notifications';
import {
  getAuthenticatedUserMetaData,
  getAuthenticatedUserName,
  getIsLoadingNotifications,
  getNotifications,
} from '../../reducers';
import { getUserMetadata } from '../../user/usersActions';
import { PATH_NAME_ACTIVE } from '../../../common/constants/rewards';
import { logout } from '../../auth/authActions';
import ModalSignIn from '../Navigation/ModlaSignIn/ModalSignIn';
import LanguageSettings from '../Navigation/LanguageSettings';

const HeaderButtons = props => {
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [notificationsPopoverVisible, setNotificationsPopoverVisible] = useState(false);
  const {
    intl,
    username,
    notifications,
    userMetaData,
    loadingNotifications,
    history,
    location,
  } = props;
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

  const handleScrollToTop = () => {
    if (window) {
      window.scrollTo(0, 0);
    }
  };

  const handleCloseNotificationsPopover = () => setNotificationsPopoverVisible(false);

  const handleMoreMenuVisibleChange = visible => setPopoverVisible(visible);

  const handleNotificationsPopoverVisibleChange = visible =>
    setNotificationsPopoverVisible(visible);

  const handleMenuItemClick = key => {
    switch (key) {
      case 'logout':
        props.logout();
        break;
      case 'activity':
        history.push('/activity');
        break;
      case 'replies':
        history.push('/replies');
        break;
      case 'bookmarks':
        history.push('/bookmarks');
        break;
      case 'drafts':
        history.push('/drafts');
        break;
      case 'settings':
        history.push('/settings');
        break;
      case 'feed':
        history.push('/');
        break;
      case 'news':
        history.push('/trending');
        break;
      case 'objects':
        history.push('/objects');
        break;
      case 'wallet':
        history.push(`/@${username}/transfers`);
        break;
      case 'my-profile':
        history.push(`/@${username}`);
        break;
      case 'rewards':
        history.push(PATH_NAME_ACTIVE);
        break;
      case 'discover':
        history.push(`/discover-objects/hashtag`);
        break;
      case 'tools':
        history.push(`/drafts`);
        break;
      default:
        break;
    }
  };

  const handleMoreMenuSelect = key => {
    setPopoverVisible(false);
    handleMenuItemClick(key);
  };

  if (!username) {
    const next = location.pathname.length > 1 ? location.pathname : '';
    return (
      <div className={'Topnav__menu-container Topnav__menu-logged-out'}>
        <Menu className="Topnav__menu-container__menu" mode="horizontal">
          <Menu.Item key="login">
            <ModalSignIn next={next} />
          </Menu.Item>
          <Menu.Item key="language">
            <LanguageSettings />
          </Menu.Item>
        </Menu>
      </div>
    );
  }

  return (
    <div className="Topnav__menu-container">
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
                  onNotificationClick={handleCloseNotificationsPopover}
                  currentAuthUsername={username}
                  lastSeenTimestamp={lastSeenTimestamp}
                  loadingNotifications={loadingNotifications}
                  getUpdatedUserMetadata={props.getUserMetadata}
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
            </Popover>
          </BTooltip>
        </Menu.Item>
        <Menu.Item key="user" className="Topnav__item-user">
          <Link className="Topnav__user" to={`/@${username}`} onClick={handleScrollToTop}>
            <Avatar username={username} size={36} />
          </Link>
        </Menu.Item>
        <Menu.Item key="more" className="Topnav__menu--icon">
          <Popover
            placement="bottom"
            trigger="click"
            visible={popoverVisible}
            onVisibleChange={handleMoreMenuVisibleChange}
            overlayStyle={{ position: 'fixed' }}
            content={
              <PopoverMenu onSelect={handleMoreMenuSelect}>
                <PopoverMenuItem key="feed" topNav>
                  <FormattedMessage id="feed" defaultMessage=" My Feed" />
                </PopoverMenuItem>
                <PopoverMenuItem key="rewards" topNav>
                  <FormattedMessage id="menu_rewards" defaultMessage="Rewards" />
                </PopoverMenuItem>
                <PopoverMenuItem key="discover" topNav>
                  <FormattedMessage id="menu_discover" defaultMessage="Discover" />
                </PopoverMenuItem>
                <PopoverMenuItem key="tools" topNav>
                  <FormattedMessage id="menu_tools" defaultMessage="Tools" />
                </PopoverMenuItem>
                <PopoverMenuItem key="my-profile" topNav>
                  <FormattedMessage id="my_profile" defaultMessage="Profile" />
                </PopoverMenuItem>
                <PopoverMenuItem key="wallet" topNav>
                  <FormattedMessage id="wallet" defaultMessage="Wallet" />
                </PopoverMenuItem>
                <PopoverMenuItem key="settings" topNav>
                  <FormattedMessage id="settings" defaultMessage="Settings" />
                </PopoverMenuItem>
                <PopoverMenuItem key="logout" topNav>
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

HeaderButtons.propTypes = {
  intl: PropTypes.shape().isRequired,
  notifications: PropTypes.arrayOf(PropTypes.shape()),
  userMetaData: PropTypes.shape(),
  loadingNotifications: PropTypes.bool,
  getUserMetadata: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
  username: PropTypes.string,
};

HeaderButtons.defaultProps = {
  notifications: [],
  username: '',
  userMetaData: {},
  loadingNotifications: false,
  isStartSearchAutoComplete: false,
};

export default connect(
  state => ({
    userMetaData: getAuthenticatedUserMetaData(state),
    username: getAuthenticatedUserName(state),
    notifications: getNotifications(state),
    loadingNotifications: getIsLoadingNotifications(state),
  }),
  {
    getUserMetadata,
    logout,
  },
)(withRouter(injectIntl(HeaderButtons)));
