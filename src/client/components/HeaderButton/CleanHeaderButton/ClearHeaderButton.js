import { Icon } from 'antd';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { memo } from 'react';
import BTooltip from '../../BTooltip';
import LanguageSettings from '../../Navigation/LanguageSettings';
import Notifications from '../../Navigation/Notifications/Notifications';
import Popover from '../../Popover';
import PopoverMenu from '../../PopoverMenu/PopoverMenu';

import './ClearHeaderButton.less';

const CleanHeaderButton = memo(
  ({
    intl,
    notifications,
    username,
    lastSeenTimestamp,
    loadingNotifications,
    notificationsPopoverVisible,
    handleNotificationsPopoverVisibleChange,
    handleCloseNotificationsPopover,
    getUserMetadata,
    displayBadge,
    notificationsCountDisplay,
    popoverVisible,
    handleMoreMenuVisibleChange,
    handleMoreMenuSelect,
    popoverItems,
    searchBarActive,
  }) => (
    <div
      className={classNames('HeaderCleanButtons', {
        'HeaderCleanButtons--hidden': searchBarActive,
      })}
    >
      <div className="HeaderCleanButtons__item">
        <LanguageSettings
          triggerButtonClass="HeaderCleanButtons__iconBtn"
          iconClassName="iconfont icon-earth"
        />
      </div>
      <div className="HeaderCleanButtons__item">
        <Popover
          placement="bottomRight"
          trigger="click"
          visible={popoverVisible}
          onVisibleChange={handleMoreMenuVisibleChange}
          overlayStyle={{ position: 'fixed' }}
          content={<PopoverMenu onSelect={handleMoreMenuSelect}>{popoverItems}</PopoverMenu>}
          overlayClassName="Topnav__popover"
        >
          <button type="button" className="HeaderCleanButtons__iconBtn" aria-label="User menu">
            <i className="iconfont icon-user" />
          </button>
        </Popover>
      </div>
      <div className="HeaderCleanButtons__item">
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
            title={intl.formatMessage({
              id: 'notifications',
              defaultMessage: 'Notifications',
            })}
          >
            <button
              type="button"
              className="HeaderCleanButtons__iconBtn HeaderCleanButtons__iconBtn--bag"
              aria-label="Notifications"
            >
              {displayBadge ? (
                <span className="HeaderCleanButtons__badge">{notificationsCountDisplay}</span>
              ) : (
                <Icon type="user" />
              )}
            </button>
          </Popover>
        </BTooltip>
      </div>
    </div>
  ),
);

CleanHeaderButton.propTypes = {
  username: PropTypes.string,
  lastSeenTimestamp: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
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
  handleNotificationsPopoverVisibleChange: PropTypes.func,
  getUserMetadata: PropTypes.func,
  notifications: PropTypes.arrayOf(PropTypes.shape({})),
  popoverItems: PropTypes.arrayOf(PropTypes.node),
};

export default CleanHeaderButton;
