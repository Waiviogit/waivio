import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import { Link } from 'react-router-dom';
import { epochToUTC } from '../../../helpers/formatter';
import Avatar from '../../Avatar';
import './Notification.less';

const NotificationRejectUpdate = ({ notification, read, onClick }) => {
  const url = `/object/${notification.author_permlink}/updates/${notification.fieldName}`;
  return (
    <Link
      to={url}
      onClick={onClick}
      className={classNames('Notification', {
        'Notification--unread': !read,
      })}
    >
      <Avatar username={notification.voter} size={40} />
      <div className="Notification__text">
        <div className="Notification__text__message">
          <FormattedMessage
            id="reject_update"
            defaultMessage="{voter} rejected your update for {fieldName}"
            values={{
              voter: <span className="username">{notification.voter}</span>,
              fieldName: <span>{notification.fieldName}</span>,
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

NotificationRejectUpdate.propTypes = {
  read: PropTypes.bool,
  notification: PropTypes.shape({
    voter: PropTypes.string,
    fieldName: PropTypes.string,
    timestamp: PropTypes.number,
    author_permlink: PropTypes.string,
  }),
  onClick: PropTypes.func,
};

NotificationRejectUpdate.defaultProps = {
  read: false,
  notification: {},
  onClick: () => {},
};

export default NotificationRejectUpdate;
