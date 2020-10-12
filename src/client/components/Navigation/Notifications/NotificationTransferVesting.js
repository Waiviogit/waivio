import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import { Link } from 'react-router-dom';
import { epochToUTC } from '../../../helpers/formatter';
import Avatar from '../../Avatar';
import './Notification.less';

const NotificationTransferVesting = ({ notification, read, onClick }) => {
  const url = `/@${notification.from}/transfers`;

  return (
    <Link
      to={url}
      onClick={onClick}
      className={classNames('Notification', {
        'Notification--unread': !read,
      })}
    >
      <Avatar username={notification.from} size={40} />
      <div className="Notification__text">
        <div className="Notification__text__message">
          <FormattedMessage
            id="transfer_to_vesting"
            defaultMessage="{from} sent to {to} {amount}"
            values={{
              from: <span className="username">{notification.from}</span>,
              to: <span>{notification.to}</span>,
              amount: <span>{notification.amount}</span>,
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

NotificationTransferVesting.propTypes = {
  read: PropTypes.bool,
  notification: PropTypes.shape({
    from: PropTypes.string,
    to: PropTypes.string,
    amount: PropTypes.string,
    timestamp: PropTypes.number,
  }),
  onClick: PropTypes.func,
};

NotificationTransferVesting.defaultProps = {
  read: false,
  notification: {},
  onClick: () => {},
};

export default NotificationTransferVesting;
