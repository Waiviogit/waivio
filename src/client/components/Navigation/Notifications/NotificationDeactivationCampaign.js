import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import { Link } from 'react-router-dom';
import { epochToUTC } from '../../../helpers/formatter';
import Avatar from '../../Avatar';
import './Notification.less';

const NotificationDeacticationCampaign = ({ notification, read, onClick }) => {
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
          <FormattedMessage
            id="deactivation_campaign"
            defaultMessage="{author} has deactivated the campaign for {object_name}"
            values={{
              author: <span className="username">{notification.author}</span>,
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

NotificationDeacticationCampaign.propTypes = {
  read: PropTypes.bool,
  notification: PropTypes.shape({
    author: PropTypes.string,
    object_name: PropTypes.string,
    timestamp: PropTypes.number,
    author_permlink: PropTypes.string,
    campaignName: PropTypes.string,
  }),
  onClick: PropTypes.func,
};

NotificationDeacticationCampaign.defaultProps = {
  read: false,
  notification: {},
  onClick: () => {},
};

export default NotificationDeacticationCampaign;
