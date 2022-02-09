import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import { Link } from 'react-router-dom';
import { epochToUTC } from '../../../../common/helpers/formatter';
import Avatar from '../../Avatar';
import './Notification.less';

const NotificationPowerDown = ({ notification, read, onClick, currentAuthUsername }) => {
  const url = `/@${notification.account}/transfers`;
  const usernameVal = notification.account === currentAuthUsername ? 'You' : notification.account;

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
            id="power_down_notification"
            defaultMessage="{usernameVal} initiated 'Power Down' on {amount}"
            values={{
              username: <span className="username">{usernameVal}</span>,
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

NotificationPowerDown.propTypes = {
  read: PropTypes.bool,
  notification: PropTypes.shape({
    account: PropTypes.string,
    timestamp: PropTypes.number,
    amount: PropTypes.string,
  }),
  onClick: PropTypes.func,
  currentAuthUsername: PropTypes.string,
};

NotificationPowerDown.defaultProps = {
  read: false,
  notification: {},
  onClick: () => {},
  currentAuthUsername: '',
};

export default NotificationPowerDown;
