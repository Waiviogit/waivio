import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import { Link } from 'react-router-dom';
import { epochToUTC } from '../../../../common/helpers/formatter';
import Avatar from '../../Avatar';
import './Notification.less';

const NotificationChangeStatus = ({ notification, read, onClick }) => {
  const statusUrl = `/object/${notification.author_permlink}/updates/status`;
  const currentClass = classNames('Notification', {
    'Notification--unread': !read,
  });

  return (
    notification.newStatus && (
      <Link to={statusUrl} onClick={onClick} className={currentClass}>
        <Avatar username={notification.author} size={40} />
        <div className="Notification__text">
          <div className="Notification__text__message">
            <FormattedMessage
              id="status_change"
              defaultMessage="{username} marked {restaurant} as {status}"
              values={{
                username: <span className="username">{notification.author}</span>,
                restaurant: <span className="object_name">{notification.object_name}</span>,
                status: <span className="newStatus">{notification.newStatus}</span>,
              }}
            />
          </div>
          <div className="Notification__text__date">
            <FormattedRelative value={epochToUTC(notification.timestamp)} />
          </div>
        </div>
      </Link>
    )
  );
};

NotificationChangeStatus.propTypes = {
  read: PropTypes.bool,
  notification: PropTypes.shape({
    author: PropTypes.string,
    timestamp: PropTypes.number,
    object_name: PropTypes.string,
    author_permlink: PropTypes.string,
    newStatus: PropTypes.string,
  }),
  onClick: PropTypes.func,
};

NotificationChangeStatus.defaultProps = {
  read: false,
  notification: {},
  onClick: () => {},
};

export default NotificationChangeStatus;
