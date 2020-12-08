import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import { Link } from 'react-router-dom';
import { epochToUTC } from '../../../helpers/formatter';
import Avatar from '../../Avatar';
import './Notification.less';

const NotificationCampaignReservation = ({ notification, read, onClick }) => {
  const currentFilter = notification.isReleased ? 'released=Released' : 'reserved=Reserved';
  const url = `/rewards/guideHistory?campaign=${notification.campaignName}&${currentFilter}`;

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
          {notification.isReleased ? (
            <FormattedMessage
              id="notification_campaign_released_reservation"
              defaultMessage="{author} released a reservation for {campaignName}"
              values={{
                author: <span className="username">{notification.author}</span>,
                campaignName: <span>{notification.campaignName}</span>,
              }}
            />
          ) : (
            <FormattedMessage
              id="notification_campaign_reserved_reservation"
              defaultMessage="{author} made a reservation for {campaignName}"
              values={{
                author: <span className="username">{notification.author}</span>,
                campaignName: <span>{notification.campaignName}</span>,
              }}
            />
          )}
        </div>
        <div className="Notification__text__date">
          <FormattedRelative value={epochToUTC(notification.timestamp)} />
        </div>
      </div>
    </Link>
  );
};

NotificationCampaignReservation.propTypes = {
  read: PropTypes.bool,
  notification: PropTypes.shape({
    type: PropTypes.string,
    campaignName: PropTypes.string,
    timestamp: PropTypes.number,
    author: PropTypes.string,
    isReleased: PropTypes.bool,
  }),
  onClick: PropTypes.func,
};

NotificationCampaignReservation.defaultProps = {
  read: false,
  notification: {},
  onClick: () => {},
};

export default NotificationCampaignReservation;
