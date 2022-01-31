import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import { Link } from 'react-router-dom';
import { epochToUTC } from '../../../../common/helpers/formatter';
import Avatar from '../../Avatar';
import './Notification.less';

const NotificationChangeRecoveryAccount = ({ notification, read, onClick }) => {
  const url = `/@${notification.new_recovery_account}`;

  return (
    <Link
      to={url}
      onClick={onClick}
      className={classNames('Notification', {
        'Notification--unread': !read,
      })}
    >
      <Avatar username={notification.account_to_recover} size={40} />
      <div className="Notification__text">
        <div className="Notification__text__message">
          <FormattedMessage
            id="change_password"
            defaultMessage="Account {account} initiated a password change procedure"
            values={{
              account_to_recover: (
                <span className="username">{notification.account_to_recover}</span>
              ),
              new_recovery_account: (
                <span className="username">{notification.new_recovery_account}</span>
              ),
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

NotificationChangeRecoveryAccount.propTypes = {
  read: PropTypes.bool,
  notification: PropTypes.shape({
    account_to_recover: PropTypes.string,
    new_recovery_account: PropTypes.string,
    timestamp: PropTypes.number,
  }),
  onClick: PropTypes.func,
};

NotificationChangeRecoveryAccount.defaultProps = {
  read: false,
  notification: {},
  onClick: () => {},
};

export default NotificationChangeRecoveryAccount;
