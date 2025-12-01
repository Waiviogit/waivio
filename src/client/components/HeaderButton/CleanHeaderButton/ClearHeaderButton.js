import { Icon } from 'antd';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { isMobile } from '../../../../common/helpers/apiHelpers';
import BTooltip from '../../BTooltip';
import LanguageSettings from '../../Navigation/LanguageSettings';
import ModalSignIn from '../../Navigation/ModlaSignIn/ModalSignIn';
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
    isSocialGifts,
    domain,
    next,
  }) => {
    if (!username) {
      return (
        <div
          className={classNames('HeaderCleanButtons', {
            'HeaderCleanButtons--hidden': searchBarActive,
          })}
        >
          <div className="HeaderCleanButtons__item">
            <LanguageSettings triggerButtonClass="HeaderCleanButtons__iconBtn" useGlobalIcon />
          </div>
          <div className="HeaderCleanButtons__item">
            <ModalSignIn isSocialGifts={isSocialGifts} domain={domain} next={next} />
          </div>
        </div>
      );
    }

    return (
      <div
        className={classNames('HeaderCleanButtons', {
          'HeaderCleanButtons--hidden': searchBarActive,
        })}
      >
        {/* Editor button */}
        <div className="HeaderCleanButtons__item">
          <BTooltip
            placement="bottom"
            title={intl.formatMessage({ id: 'write_post', defaultMessage: 'Write post' })}
            mouseEnterDelay={1}
            overlayClassName={classNames('Topnav__notifications-tooltip', {
              'Topnav__notifications-tooltip--hide': isMobile(),
            })}
          >
            <Link to="/editor" className="HeaderCleanButtons__iconBtn">
              <Icon type="edit" />
            </Link>
          </BTooltip>
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
                <Icon type="message" />
                {displayBadge && (
                  <span className="HeaderCleanButtons__badge">{notificationsCountDisplay}</span>
                )}
              </button>
            </Popover>
          </BTooltip>
        </div>
        {/* User profile link */}
        <div className="HeaderCleanButtons__item">
          <BTooltip
            placement="bottom"
            title={intl.formatMessage({ id: 'profile', defaultMessage: 'Profile' })}
            mouseEnterDelay={1}
            overlayClassName={classNames('Topnav__notifications-tooltip', {
              'Topnav__notifications-tooltip--hide': isMobile(),
            })}
          >
            <Link to={`/@${username}`} className="HeaderCleanButtons__iconBtn">
              <Icon type="user" />
            </Link>
          </BTooltip>
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
            <button type="button" className="HeaderCleanButtons__iconBtn" aria-label="Menu">
              <Icon type="more" />
            </button>
          </Popover>
        </div>
      </div>
    );
  },
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
  isSocialGifts: PropTypes.bool,
  domain: PropTypes.string,
  next: PropTypes.func,
  notifications: PropTypes.arrayOf(PropTypes.shape({})),
  popoverItems: PropTypes.arrayOf(PropTypes.node),
};

export default CleanHeaderButton;
