import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';
import { filter, get, includes, isUndefined, size } from 'lodash';
import { PARSED_NOTIFICATIONS } from '../../../../../common/constants/notifications';
import BTooltip from '../../../BTooltip';
import HotNews from '../../HotNews';
import PopoverContainer from '../../../Popover';
import Notifications from '../../Notifications/Notifications';
import './MenuButtons.less';

const MenuButtons = ({
  intl,
  username,
  userMetaData,
  notifications,
  toggleMenu,
  handleCloseNotificationsPopover,
  loadingNotifications,
  handleNotificationsPopoverVisibleChange,
  notificationsPopoverVisible,
  getUserMetadata,
}) => {
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
  const handleOnNotificationClick = () => {
    handleCloseNotificationsPopover();
    toggleMenu();
  };
  return (
    <div className="MenuButtons">
      <Menu className="MenuButtons__wrap" mode="horizontal">
        <Menu.Item className="MenuButtons__item" key="write" onClick={toggleMenu}>
          <BTooltip
            placement="bottom"
            title={intl.formatMessage({ id: 'write_post', defaultMessage: 'Write post' })}
            overlayClassName="MenuButtons__notifications-tooltip"
            mouseEnterDelay={1}
          >
            <Link to="/editor" className="MenuButtons__item-link">
              <i className="iconfont icon-write" />
            </Link>
          </BTooltip>
        </Menu.Item>
        <Menu.Item className="MenuButtons__item" onClick={toggleMenu}>
          <Link to="/" className="MenuButtons__item-link">
            <img className="feed" alt="feed" src={'/images/icons/ia-icon-feed.svg'} />
          </Link>
        </Menu.Item>
        <Menu.Item className="MenuButtons__item" key="hot">
          <HotNews isMobile toggleMobileMenu={toggleMenu} />
        </Menu.Item>
        <Menu.Item className="MenuButtons__item" key="notifications">
          <BTooltip
            placement="bottom"
            title={intl.formatMessage({ id: 'notifications', defaultMessage: 'Notifications' })}
            overlayClassName="MenuButtons__notifications-tooltip"
            mouseEnterDelay={1}
          >
            <PopoverContainer
              placement="bottomRight"
              trigger="click"
              content={
                <Notifications
                  notifications={notifications}
                  onNotificationClick={handleOnNotificationClick}
                  st-card__chart
                  currentAuthUsername={username}
                  lastSeenTimestamp={lastSeenTimestamp}
                  loadingNotifications={loadingNotifications}
                  getUpdatedUserMetadata={getUserMetadata}
                />
              }
              visible={notificationsPopoverVisible}
              onVisibleChange={handleNotificationsPopoverVisibleChange}
              overlayClassName="NewsOverlay__popover-overlay"
              title={intl.formatMessage({ id: 'notifications', defaultMessage: 'Notifications' })}
            >
              <a className="MenuButtons__item-link">
                {displayBadge ? (
                  <div className="MenuButtons__notifications-count">
                    {notificationsCountDisplay}
                  </div>
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

MenuButtons.propTypes = {
  toggleMenu: PropTypes.func.isRequired,
  intl: PropTypes.shape().isRequired,
  username: PropTypes.string,
  notifications: PropTypes.arrayOf(PropTypes.shape()),
  userMetaData: PropTypes.shape(),
  loadingNotifications: PropTypes.bool,
  notificationsPopoverVisible: PropTypes.bool,
  handleCloseNotificationsPopover: PropTypes.func.isRequired,
  getUserMetadata: PropTypes.func.isRequired,
  handleNotificationsPopoverVisibleChange: PropTypes.func.isRequired,
};

MenuButtons.defaultProps = {
  username: '',
  notifications: [],
  userMetaData: {},
  loadingNotifications: false,
  notificationsPopoverVisible: false,
};

export default injectIntl(MenuButtons);
