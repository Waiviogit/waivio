import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import { Link } from 'react-router-dom';
import { epochToUTC } from '../../../../common/helpers/formatter';
import Avatar from '../../Avatar';
import './Notification.less';

const NotificationTemplate = ({
  notification,
  read,
  onClick,
  url,
  username,
  values,
  defaultMessage,
  id,
}) => (
  <Link
    to={url}
    onClick={onClick}
    className={classNames('Notification', {
      'Notification--unread': !read,
    })}
  >
    {username && <Avatar username={username} size={40} />}
    <div className="Notification__text">
      <div className="Notification__text__message">
        <FormattedMessage id={id} defaultMessage={defaultMessage} values={values} />
      </div>
      <div className="Notification__text__date">
        <FormattedRelative value={epochToUTC(notification.timestamp)} />
      </div>
    </div>
  </Link>
);

NotificationTemplate.propTypes = {
  read: PropTypes.bool,
  url: PropTypes.string.isRequired,
  username: PropTypes.string,
  defaultMessage: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  values: PropTypes.shape(),
  notification: PropTypes.shape({
    author: PropTypes.string,
    object_name: PropTypes.string,
    timestamp: PropTypes.number,
    author_permlink: PropTypes.string,
  }),
  onClick: PropTypes.func,
};

NotificationTemplate.defaultProps = {
  read: false,
  notification: {},
  username: '',
  values: {},
  onClick: () => {},
};

export default NotificationTemplate;
