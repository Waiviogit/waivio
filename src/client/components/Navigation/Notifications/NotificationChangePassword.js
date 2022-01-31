import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import { Link } from 'react-router-dom';
import { epochToUTC } from '../../../../common/helpers/formatter';
import Avatar from '../../Avatar';
import './Notification.less';

const NotificationChangePassword = ({ notification, read, onClick }) => {
  const url = `/@${notification.account}`;

  return (
    <Link
      to={url}
      onClick={onClick}
      className={classNames('Notification', {
        'Notification--unread': !read,
      })}
    >
      <Avatar username={notification.account} size={40} />
      <div className="Notification__text">
        <div className="Notification__text__message">
          <FormattedMessage
            id="change_password"
            defaultMessage="Account {account} initiated a password change procedure"
            values={{
              account: <span className="username">{notification.account}</span>,
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

NotificationChangePassword.propTypes = {
  read: PropTypes.bool,
  notification: PropTypes.shape({
    account: PropTypes.string,
    timestamp: PropTypes.number,
  }),
  onClick: PropTypes.func,
};

NotificationChangePassword.defaultProps = {
  read: false,
  notification: {},
  onClick: () => {},
};

export default NotificationChangePassword;
