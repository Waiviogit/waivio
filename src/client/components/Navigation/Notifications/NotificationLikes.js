import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import { Link } from 'react-router-dom';
import Avatar from '../../Avatar';
import { epochToUTC } from '../../../helpers/formatter';
import './Notification.less';

const getCurrentTextNotification = notification => {
  if (!notification.likesCount) {
    return (
      <FormattedMessage
        id="like_post_notify_priority"
        defaultMessage="{voter} liked your post '{postTitle}'"
        values={{
          voter: <span className="username">{notification.voter}</span>,
          postTitle: <span>{notification.title}</span>,
        }}
      />
    );
  }

  return (
    <FormattedMessage
      id="like_post_notify_other"
      defaultMessage="{voter} and {likesCount} others liked your post '{postTitle}'"
      values={{
        voter: <span className="username">{notification.voter}</span>,
        likesCount: <span>{notification.likesCount}</span>,
        postTitle: <span>{notification.title}</span>,
      }}
    />
  );
};

const NotificationLikes = ({ notification, read, onClick }) => (
  <Link
    to={`/@${notification.author}/${notification.permlink}`}
    className={classNames('Notification', {
      'Notification--unread': !read,
    })}
    onClick={onClick}
  >
    <Avatar username={notification.voter} size={40} />
    <div className="Notification__text">
      <div className="Notification__text__message">{getCurrentTextNotification(notification)}</div>
      <div className="Notification__text__date">
        <FormattedRelative value={epochToUTC(notification.timestamp)} />
      </div>
    </div>
  </Link>
);

NotificationLikes.propTypes = {
  read: PropTypes.bool,
  notification: PropTypes.shape({
    type: PropTypes.string,
    voter: PropTypes.string,
    likesCount: PropTypes.number,
    title: PropTypes.string,
    author: PropTypes.string,
    permlink: PropTypes.string,
    timestamp: PropTypes.number,
  }),
  onClick: PropTypes.func,
};

NotificationLikes.defaultProps = {
  read: false,
  notification: {},
  onClick: () => {},
};

export default NotificationLikes;
