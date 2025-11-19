import { Menu, Icon } from 'antd';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { isMobile } from '../../../common/helpers/apiHelpers';
import Avatar from '../Avatar';
import BTooltip from '../BTooltip';
import Notifications from '../Navigation/Notifications/Notifications';
import Popover from '../Popover';
import PopoverMenu from '../PopoverMenu/PopoverMenu';

const ClassicHeaderButton = memo(
  ({
    searchBarActive,
    intl,
    handleEditor,
    notifications,
    handleCloseNotificationsPopover,
    username,
    lastSeenTimestamp,
    loadingNotifications,
    getUserMetadata,
    notificationsPopoverVisible,
    handleNotificationsPopoverVisibleChange,
    displayBadge,
    notificationsCountDisplay,
    handleScrollToTop,
    popoverVisible,
    handleMoreMenuVisibleChange,
    handleMoreMenuSelect,
    popoverItems,
  }) => (
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
            overlayClassName={classNames('Topnav__notifications-tooltip', {
              'Topnav__notifications-tooltip--hide': isMobile(),
            })}
          >
            <Link to="/editor" className="Topnav__link Topnav__link--action" onClick={handleEditor}>
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
            content={<PopoverMenu onSelect={handleMoreMenuSelect}>{popoverItems}</PopoverMenu>}
            overlayClassName="Topnav__popover"
          >
            <a className="Topnav__link">
              <Icon type="caret-down" />
              <Icon type="bars" />
            </a>
          </Popover>
        </Menu.Item>
      </Menu>
    </div>
  ),
);

ClassicHeaderButton.propTypes = {
  username: PropTypes.string,
  lastSeenTimestamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  popoverVisible: PropTypes.bool,
  displayBadge: PropTypes.bool,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }),
  loadingNotifications: PropTypes.bool,
  notificationsPopoverVisible: PropTypes.bool,
  notificationsCountDisplay: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  searchBarActive: PropTypes.bool,
  handleMoreMenuVisibleChange: PropTypes.func,
  handleMoreMenuSelect: PropTypes.func,
  handleCloseNotificationsPopover: PropTypes.func,
  handleScrollToTop: PropTypes.func,
  handleNotificationsPopoverVisibleChange: PropTypes.func,
  handleEditor: PropTypes.func,
  getUserMetadata: PropTypes.func,
  notifications: PropTypes.arrayOf(PropTypes.shape({})),
  popoverItems: PropTypes.arrayOf(PropTypes.node),
};

export default ClassicHeaderButton;
