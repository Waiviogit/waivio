import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import { Link } from 'react-router-dom';
import { epochToUTC } from '../../../helpers/formatter';
import Avatar from '../../Avatar';
import './Notification.less';

const NotificationActicationCampaign = ({ notification, read, onClick }) => {
  const url = `/object/@${notification.author}`;

  return (
    <Link
      to={url}
      onClick={onClick}
      className={classNames('Notification', {
        'Notification--unread': !read,
      })}
    >
      <Avatar username={notification.author} size={40} />
      <div className="Notification__text">
        <div className="Notification__text__message">
          <FormattedMessage
            id="activation_campaign"
            defaultMessage="{author} launched a new campaign for {object_name}"
            values={{
              author: <span>{notification.author}</span>,
              object_name: <span>{notification.object_name}</span>,
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

NotificationActicationCampaign.propTypes = {
  read: PropTypes.bool,
  notification: PropTypes.shape({
    author: PropTypes.string,
    object_name: PropTypes.number,
    timestamp: PropTypes.number,
  }),
  onClick: PropTypes.func,
};

NotificationActicationCampaign.defaultProps = {
  read: false,
  notification: {},
  onClick: () => {},
};

export default NotificationActicationCampaign;
