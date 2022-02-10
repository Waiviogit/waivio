import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import { Link } from 'react-router-dom';
import Avatar from '../../Avatar';
import { epochToUTC } from '../../../../common/helpers/formatter';
import './Notification.less';
import { getWalletType, isEmptyAmount } from '../../../../common/helpers/notificationsHelper';

const NotificationDelegateVestingSharesTo = ({ notification, read, onClick }) => {
  const transferUrl = `/@${notification.from}/transfers?type=${getWalletType(notification.amount)}`;

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
          {isEmptyAmount(notification.amount) ? (
            <FormattedMessage
              id="delegate_vesting_shares"
              defaultMessage="{username} updated delegation {amount} to you"
              values={{
                username: <span className="username">{notification.from}</span>,
                amount: notification.amount,
              }}
            />
          ) : (
            <FormattedMessage
              id="delegate_vesting_shares"
              defaultMessage="{username} undelegated to you"
              values={{
                username: <span className="username">{notification.from}</span>,
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

NotificationDelegateVestingSharesTo.propTypes = {
  read: PropTypes.bool,
  notification: PropTypes.shape({
    timestamp: PropTypes.number,
    from: PropTypes.string,
    amount: PropTypes.string,
  }),
  onClick: PropTypes.func,
};

NotificationDelegateVestingSharesTo.defaultProps = {
  read: false,
  notification: {},
  onClick: () => {},
};

export default NotificationDelegateVestingSharesTo;
