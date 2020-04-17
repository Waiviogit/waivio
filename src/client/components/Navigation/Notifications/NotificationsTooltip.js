import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { filter, get, includes, isUndefined, size } from 'lodash';
import PopoverContainer from '../../Popover';
import Notifications from './Notifications';
import BTooltip from '../../BTooltip';
import { getUserMetadata } from '../../../user/usersActions';
import { PARSED_NOTIFICATIONS } from '../../../../common/constants/notifications';
import {
  getAuthenticateduserMetaData,
  getIsLoadingNotifications,
  getNotifications,
} from '../../../reducers';

const NotificationsTooltip = props => {
  const {
    intl,
    username,
    userMetaData,
    notifications,
    toggleMobileMenu,
    loadingNotifications,
    getMetadata,
    isMobile,
  } = props;
  const lastSeenTimestamp = get(userMetaData, 'notifications_last_timestamp');
  const [notificationsVisible, setNotificationsVisible] = useState(false);
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

  const handleCloseNotifications = () => setNotificationsVisible(false);

  const handleNotificationsVisible = visible => {
    if (visible) {
      setNotificationsVisible(visible);
    } else {
      handleCloseNotifications();
    }
  };

  const handleOnNotificationClick = () => {
    handleCloseNotifications();
    if (isMobile) toggleMobileMenu();
  };

  const notificationIcon = isMobile ? (
    <img alt="notifications" src={'/images/icons/ia-icon-bell.svg'} />
  ) : (
    <i className="iconfont icon-remind" />
  );

  return (
    <BTooltip
      placement="bottom"
      title={intl.formatMessage({ id: 'notifications', defaultMessage: 'Notifications' })}
      overlayClassName="MenuButtons__notifications-tooltip"
      mouseEnterDelay={1}
    >
      <PopoverContainer
        placement="bottomRight"
        trigger="click"
        arrowPointAtCenter
        content={
          <Notifications
            notifications={notifications}
            onNotificationClick={handleOnNotificationClick}
            st-card__chart
            currentAuthUsername={username}
            lastSeenTimestamp={lastSeenTimestamp}
            loadingNotifications={loadingNotifications}
            getUpdatedUserMetadata={getMetadata}
          />
        }
        visible={notificationsVisible}
        onVisibleChange={handleNotificationsVisible}
        overlayClassName="NewsOverlay__popover-overlay"
        title={intl.formatMessage({ id: 'notifications', defaultMessage: 'Notifications' })}
      >
        <a className="MenuButtons__item-link">
          {displayBadge ? (
            <div className="MenuButtons__notifications-count">{notificationsCountDisplay}</div>
          ) : (
            notificationIcon
          )}
        </a>
      </PopoverContainer>
    </BTooltip>
  );
};

NotificationsTooltip.propTypes = {
  toggleMobileMenu: PropTypes.func,
  isMobile: PropTypes.bool.isRequired,
  intl: PropTypes.shape().isRequired,
  username: PropTypes.string.isRequired,
  notifications: PropTypes.arrayOf(PropTypes.shape()),
  userMetaData: PropTypes.shape().isRequired,
  loadingNotifications: PropTypes.bool.isRequired,
  getMetadata: PropTypes.func.isRequired,
};

NotificationsTooltip.defaultProps = {
  notifications: [],
  userMetaData: [],
  loadingNotifications: false,
  isMobile: false,
  toggleMobileMenu: () => {},
};

const mapStateToProps = state => ({
  notifications: getNotifications(state),
  userMetaData: getAuthenticateduserMetaData(state),
  loadingNotifications: getIsLoadingNotifications(state),
});

const mapDispatchToProps = dispatch => ({
  getMetadata: () => dispatch(getUserMetadata()),
});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(NotificationsTooltip));
