import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import { Link } from 'react-router-dom';
import Avatar from '../../Avatar';
import { epochToUTC } from '../../../../common/helpers/formatter';
import './Notification.less';
import { getWalletType } from '../../../../common/helpers/notificationsHelper';

const NotificationDelegateFrom = ({ notification, read, onClick }) => {
  const transferUrl = `/@${notification.to}/transfers?type=${getWalletType(notification.amount)}`;

  return (
    <Link
      to={transferUrl}
      className={classNames('Notification', {
        'Notification--unread': !read,
      })}
      onClick={onClick}
    >
      <Avatar username={notification.to} size={40} />
      <div className="Notification__text">
        <div className="Notification__text__message">
          <FormattedMessage
            id="notification_delegate_username_amount"
            defaultMessage="You delegated {amount} to {username}"
            values={{
              username: <span className="username">{notification.to}</span>,
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

NotificationDelegateFrom.propTypes = {
  read: PropTypes.bool,
  notification: PropTypes.shape({
    timestamp: PropTypes.number,
    to: PropTypes.string,
    amount: PropTypes.string,
  }),
  onClick: PropTypes.func,
};

NotificationDelegateFrom.defaultProps = {
  read: false,
  notification: {},
  onClick: () => {},
};

export default NotificationDelegateFrom;
