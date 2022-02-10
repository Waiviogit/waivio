import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import { Link } from 'react-router-dom';
import { epochToUTC } from '../../../../common/helpers/formatter';
import Avatar from '../../Avatar';
import './Notification.less';

const NotificationTransferFromSavings = ({ notification, read, onClick }) => {
  const url = `/@${notification.from}/transfers/`;

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
            id="transfer_from_savings"
            defaultMessage="Account {from} initiated a power down on the saving account to {to}"
            values={{
              from: <span className="username">{notification.from}</span>,
              to: <span className="username">{notification.to}</span>,
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

NotificationTransferFromSavings.propTypes = {
  read: PropTypes.bool,
  notification: PropTypes.shape({
    to: PropTypes.string,
    from: PropTypes.string,
    timestamp: PropTypes.number,
  }),
  onClick: PropTypes.func,
};

NotificationTransferFromSavings.defaultProps = {
  read: false,
  notification: {},
  onClick: () => {},
};

export default NotificationTransferFromSavings;
