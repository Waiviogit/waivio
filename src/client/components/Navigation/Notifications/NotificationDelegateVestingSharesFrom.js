import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import { Link } from 'react-router-dom';
import Avatar from '../../Avatar';
import { epochToUTC } from '../../../../common/helpers/formatter';
import './Notification.less';

const NotificationDelegateVestingSharesFrom = ({
  notification,
  read,
  onClick,
  currentAuthUsername,
}) => {
  const transferUrl = `/@${currentAuthUsername}/transfers`;
  const amount = notification.amount;
  const amountToNum = amount.replace('HIVE', '').trim();

  return (
    <Link
      to={transferUrl}
      className={classNames('Notification', {
        'Notification--unread': !read,
      })}
      onClick={onClick}
    >
      <Avatar username={currentAuthUsername} size={40} />
      <div className="Notification__text">
        <div className="Notification__text__message">
          {+amountToNum ? (
            <FormattedMessage
              id="delegate_vesting_shares"
              defaultMessage="You updated delegation {amount} to {username}"
              values={{
                username: <span className="username">{notification.to}</span>,
                amount: notification.amount,
              }}
            />
          ) : (
            <FormattedMessage
              id="delegate_vesting_shares"
              defaultMessage="You undelegated to {username}"
              values={{
                username: <span className="username">{notification.to}</span>,
                amount: notification.amount,
              }}
            />
          )}
        </div>
        <div className="Notification__text__date">
          <FormattedRelative value={epochToUTC(notification.timestamp)} />
        </div>
      </div>
    </Link>
  );
};

NotificationDelegateVestingSharesFrom.propTypes = {
  read: PropTypes.bool,
  notification: PropTypes.shape({
    follower: PropTypes.string,
    timestamp: PropTypes.number,
    to: PropTypes.string,
    amount: PropTypes.string,
  }),
  onClick: PropTypes.func,
  currentAuthUsername: PropTypes.string,
};

NotificationDelegateVestingSharesFrom.defaultProps = {
  read: false,
  notification: {},
  onClick: () => {},
  currentAuthUsername: '',
};

export default NotificationDelegateVestingSharesFrom;
