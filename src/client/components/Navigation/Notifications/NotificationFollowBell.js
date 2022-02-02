import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import { Link } from 'react-router-dom';
import Avatar from '../../Avatar';
import { epochToUTC } from '../../../../common/helpers/formatter';
import './Notification.less';

const NotificationFollowBell = ({ notification, read, onClick }) => (
  <Link
    to={`/@${notification.following}`}
    className={classNames('Notification', {
      'Notification--unread': !read,
    })}
    onClick={onClick}
  >
    <Avatar username={notification.follower} size={40} />
    <div className="Notification__text">
      <div className="Notification__text__message">
        <FormattedMessage
          id="notification_bell_follow"
          defaultMessage="{follower} followed {following}"
          values={{
            follower: <span className="username">{notification.follower}</span>,
            following: <span className="username">{notification.following}</span>,
          }}
        />
      </div>
      <div className="Notification__text__date">
        <FormattedRelative value={epochToUTC(notification.timestamp)} />
      </div>
    </div>
  </Link>
);

NotificationFollowBell.propTypes = {
  read: PropTypes.bool,
  notification: PropTypes.shape({
    following: PropTypes.string,
    follower: PropTypes.string,
    permlink: PropTypes.string,
    timestamp: PropTypes.number,
  }),
  onClick: PropTypes.func,
};

NotificationFollowBell.defaultProps = {
  read: false,
  notification: {},
  onClick: () => {},
};

export default NotificationFollowBell;
