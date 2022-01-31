import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import { Link } from 'react-router-dom';
import Avatar from '../../Avatar';
import { epochToUTC } from '../../../../common/helpers/formatter';
import './Notification.less';

const NotificationMyPost = ({ notification, read, onClick }) => (
  <Link
    to={`/@${notification.author}/${notification.permlink}`}
    className={classNames('Notification', {
      'Notification--unread': !read,
    })}
    onClick={onClick}
  >
    <Avatar username={notification.author} size={40} />
    <div className="Notification__text">
      <div className="Notification__text__message">
        <FormattedMessage
          id="my_post_notify"
          defaultMessage="You created post {post}"
          values={{
            post: <span>{notification.title}</span>,
          }}
        />
      </div>
      <div className="Notification__text__date">
        <FormattedRelative value={epochToUTC(notification.timestamp)} />
      </div>
    </div>
  </Link>
);

NotificationMyPost.propTypes = {
  read: PropTypes.bool,
  notification: PropTypes.shape({
    timestamp: PropTypes.number,
    type: PropTypes.string,
    permlink: PropTypes.string,
    author: PropTypes.string,
    title: PropTypes.string,
    voter: PropTypes.string,
  }),
  onClick: PropTypes.func,
};

NotificationMyPost.defaultProps = {
  read: false,
  notification: {},
  onClick: () => {},
};

export default NotificationMyPost;
