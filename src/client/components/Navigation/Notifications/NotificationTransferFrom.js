import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import { Link } from 'react-router-dom';
import Avatar from '../../Avatar';
import { epochToUTC } from '../../../../common/helpers/formatter';
import './Notification.less';
import { getWalletType } from '../../../../common/helpers/notificationsHelper';

const NotificationTransferFrom = ({ notification, read, onClick }) => {
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
            id="transfer_from"
            defaultMessage="You transferred {amount} to {to}"
            values={{
              to: <span className="username">{notification.to}</span>,
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

NotificationTransferFrom.propTypes = {
  read: PropTypes.bool,
  notification: PropTypes.shape({
    to: PropTypes.string,
    timestamp: PropTypes.number,
    amount: PropTypes.string,
  }),
  onClick: PropTypes.func,
};

NotificationTransferFrom.defaultProps = {
  read: false,
  notification: {},
  onClick: () => {},
};

export default NotificationTransferFrom;
