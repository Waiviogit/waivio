import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import { Link } from 'react-router-dom';
import { epochToUTC } from '../../../helpers/formatter';
import Avatar from '../../Avatar';
import './Notification.less';

const NotificationChangeStatus = ({ notification, read, onClick }) => {
  // eslint-disable-next-line camelcase
  const { author, object_name, author_permlink, newStatus, timestamp } = notification;

  // eslint-disable-next-line camelcase
  const statusUrl = `/object/${author_permlink}/updates/status`;

  return (
    <Link
      to={statusUrl}
      onClick={onClick}
      className={classNames('Notification', {
        'Notification--unread': !read,
      })}
    >
      <Avatar username={author} size={40} />
      <div className="Notification__text">
        <div className="Notification__text__message">
          <FormattedMessage
            id="status_change"
            defaultMessage="{username} marked {restaurant} as {status}"
            values={{
              restaurant: object_name,
              status: newStatus,
            }}
          />
        </div>
        <div className="Notification__text__date">
          <FormattedRelative value={epochToUTC(timestamp)} />
        </div>
      </div>
    </Link>
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
