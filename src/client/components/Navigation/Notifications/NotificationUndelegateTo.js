import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import { Link } from 'react-router-dom';
import Avatar from '../../Avatar';
import { epochToUTC } from '../../../../common/helpers/formatter';
import './Notification.less';

const NotificationUndelegateTo = ({ notification, read, onClick }) => {
  const transferUrl = `/@${notification.from}/transfers`;

  return (
    <Link
      to={transferUrl}
      className={classNames('Notification', {
        'Notification--unread': !read,
      })}
      onClick={onClick}
    >
      <Avatar username={notification.from} size={40} />
      <div className="Notification__text">
        <div className="Notification__text__message">
          <FormattedMessage
            id="notification_undelegation_username_amount"
            defaultMessage="{username} started undelegation {amount} to you"
            values={{
              username: <span className="username">{notification.from}</span>,
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

NotificationUndelegateTo.propTypes = {
  read: PropTypes.bool,
  notification: PropTypes.shape({
    timestamp: PropTypes.number,
    from: PropTypes.string,
    amount: PropTypes.string,
  }),
  onClick: PropTypes.func,
};

NotificationUndelegateTo.defaultProps = {
  read: false,
  notification: {},
  onClick: () => {},
};

export default NotificationUndelegateTo;
