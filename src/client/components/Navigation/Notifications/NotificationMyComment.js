import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import { Link } from 'react-router-dom';
import Avatar from '../../Avatar';
import { epochToUTC } from '../../../../common/helpers/formatter';
import './Notification.less';

const NotificationMyComment = ({ notification, read, onClick }) => (
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
          id="my_comment_notify"
          defaultMessage="You replied to {parentAuthor}"
          values={{
            parentAuthor: <span>{notification.parentAuthor}</span>,
          }}
        />
      </div>
      <div className="Notification__text__date">
        <FormattedRelative value={epochToUTC(notification.timestamp)} />
      </div>
    </div>
  </Link>
);

NotificationMyComment.propTypes = {
  read: PropTypes.bool,
  notification: PropTypes.shape({
    timestamp: PropTypes.number,
    type: PropTypes.string,
    permlink: PropTypes.string,
    author: PropTypes.string,
    parentAuthor: PropTypes.string,
    voter: PropTypes.string,
  }),
  onClick: PropTypes.func,
};

NotificationMyComment.defaultProps = {
  read: false,
  notification: {},
  onClick: () => {},
};

export default NotificationMyComment;
