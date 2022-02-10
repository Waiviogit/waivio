import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import { Link } from 'react-router-dom';
import Avatar from '../../Avatar';
import { epochToUTC } from '../../../../common/helpers/formatter';
import './Notification.less';
import { getWalletType } from '../../../../common/helpers/notificationsHelper';

const NotificationCancelUnstake = ({ notification, read, onClick, currentAuthUsername }) => {
  const transferUrl = `/@${notification.account}/transfers?type=${getWalletType(
    notification.amount,
  )}`;

  return (
    <Link
      to={transferUrl}
      className={classNames('Notification', {
        'Notification--unread': !read,
      })}
      onClick={onClick}
    >
      <Avatar username={notification.account} size={40} />
      <div className="Notification__text">
        <div className="Notification__text__message">
          <FormattedMessage
            id="notification_unstake_username_amount"
            defaultMessage="{username} cancelled power down on {amount}"
            values={{
              username: (
                <span className="username">
                  {notification.account === currentAuthUsername ? 'You' : notification.account}
                </span>
              ),
              amount: notification.amount,
            }}
          />
        </div>
        <div className="Notification__text__date">
          <FormattedRelative value={epochToUTC(notification.timestamp)} />
        </div>
      </div>
    </Link>
  );
};

NotificationCancelUnstake.propTypes = {
  read: PropTypes.bool,
  notification: PropTypes.shape({
    timestamp: PropTypes.number,
    account: PropTypes.string,
    amount: PropTypes.string,
  }),
  onClick: PropTypes.func,
  currentAuthUsername: PropTypes.string,
};

NotificationCancelUnstake.defaultProps = {
  read: false,
  notification: {},
  onClick: () => {},
  currentAuthUsername: '',
};

export default NotificationCancelUnstake;
