import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';
import classNames from 'classnames';
import { size, filter, get, isUndefined, includes } from 'lodash';
import { PARSED_NOTIFICATIONS } from '../../../common/constants/notifications';
import ModalBroker from '../../../investarena/components/Modals/ModalBroker';
import HotNews from './HotNews';
import BTooltip from '../BTooltip';
import PopoverContainer from '../Popover';
import Notifications from './Notifications/Notifications';
import Avatar from '../Avatar';
import Topnav from './Topnav';
import BurgerMenu from './BurgerMenu';

const LoggedInMenu = props => {
  const {
    intl,
    username,
    notifications,
    userMetaData,
    loadingNotifications,
    isGuest,
    searchBarActive,
    notificationsPopoverVisible,
    handleNotificationsPopoverVisibleChange,
    getUserMetadata,
    handleCloseNotificationsPopover,
    burgerMenuVisible,
    handleBurgerMenuVisibleChange,
    handleBurgerMenuSelect,
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
  return (
    <div
      className={classNames('Topnav__menu-container', {
        'Topnav__mobile-hidden': searchBarActive,
      })}
    >
      <ModalBroker />
      <Menu selectedKeys={[]} className="Topnav__menu" mode="horizontal">
        <Menu.Item className="Topnav__menu-item" key="hot">
          <HotNews />
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
        <Menu.Item className="Topnav__menu-item" key="user">
          <Link className="Topnav__user" to={`/@${username}`} onClick={Topnav.handleScrollToTop}>
            <Avatar username={username} size={36} />
          </Link>
        </Menu.Item>
        <Menu.Item className="Topnav__menu-item Topnav__menu-item--burger" key="more">
          <BurgerMenu
            isGuest={isGuest}
            burgerMenuVisible={burgerMenuVisible}
            handleBurgerMenuVisibleChange={handleBurgerMenuVisibleChange}
            handleBurgerMenuSelect={handleBurgerMenuSelect}
          />
        </Menu.Item>
      </Menu>
    </div>
  );
};

LoggedInMenu.propTypes = {
  intl: PropTypes.shape().isRequired,
  username: PropTypes.string.isRequired,
  notifications: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  userMetaData: PropTypes.shape().isRequired,
  loadingNotifications: PropTypes.bool.isRequired,
  searchBarActive: PropTypes.bool.isRequired,
  notificationsPopoverVisible: PropTypes.bool.isRequired,
  isGuest: PropTypes.bool.isRequired,
  handleNotificationsPopoverVisibleChange: PropTypes.func.isRequired,
  getUserMetadata: PropTypes.func.isRequired,
  handleCloseNotificationsPopover: PropTypes.func.isRequired,
  burgerMenuVisible: PropTypes.bool.isRequired,
  handleBurgerMenuVisibleChange: PropTypes.func.isRequired,
  handleBurgerMenuSelect: PropTypes.func.isRequired,
};

export default injectIntl(LoggedInMenu);
