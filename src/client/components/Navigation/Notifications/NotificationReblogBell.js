import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import { Link } from 'react-router-dom';
import Avatar from '../../Avatar';
import { epochToUTC } from '../../../../common/helpers/formatter';
import './Notification.less';

const NotificationReblogBell = ({ notification, read, onClick }) => (
  <Link
    to={`/@${notification.account}`}
    className={classNames('Notification', {
      'Notification--unread': !read,
    })}
    onClick={onClick}
  >
    <Avatar username={notification.account} size={40} />
    <div className="Notification__text">
      <div className="Notification__text__message">
        <FormattedMessage
          id="notification_bell_reblog"
          defaultMessage="{account} re-blogged {author}'s post: {title}"
          values={{
            account: <span className="username">{notification.account}</span>,
            author: <span className="username">{notification.author}</span>,
            title: <span>{notification.title}</span>,
          }}
        />
      </div>
      <div className="Notification__text__date">
        <FormattedRelative value={epochToUTC(notification.timestamp)} />
      </div>
    </div>
  </Link>
);

NotificationReblogBell.propTypes = {
  read: PropTypes.bool,
  notification: PropTypes.shape({
    account: PropTypes.string,
    author: PropTypes.string,
    title: PropTypes.string,
    permlink: PropTypes.string,
    timestamp: PropTypes.number,
  }),
  onClick: PropTypes.func,
};

NotificationReblogBell.defaultProps = {
  read: false,
  notification: {},
  onClick: () => {},
};

export default NotificationReblogBell;
