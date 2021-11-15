import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedRelative, FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import Avatar from '../../Avatar';
import { epochToUTC } from '../../../helpers/formatter';
import './Notification.less';

const NotificationWebsiteBalance = ({ notification, read, onClick, currentAuthUsername }) => (
  <Link
    to="/manage"
    className={classNames('Notification', {
      'Notification--unread': !read,
    })}
    onClick={onClick}
  >
    <Avatar username={currentAuthUsername} size={40} />
    <div className="Notification__text">
      {notification.message.includes('a day') && (
        <FormattedMessage id="balance_run_out_day" defaultMessage={notification.message} />
      )}
      {notification.message.includes('two days') && (
        <FormattedMessage id="balance_run_out_two_days" defaultMessage={notification.message} />
      )}
      {notification.message.includes('three days') && (
        <FormattedMessage id="balance_run_out_three_days" defaultMessage={notification.message} />
      )}
      {notification.message.includes('four days') && (
        <FormattedMessage id="balance_run_out_four_days" defaultMessage={notification.message} />
      )}
      {notification.message.includes('five days') && (
        <FormattedMessage id="balance_run_out_five_days" defaultMessage={notification.message} />
      )}
      {notification.message.includes('six days') && (
        <FormattedMessage id="balance_run_out_six_days" defaultMessage={notification.message} />
      )}
      {notification.message.includes('a week') && (
        <FormattedMessage id="balance_run_out_week" defaultMessage={notification.message} />
      )}
      {notification.message.includes('two weeks') && (
        <FormattedMessage id="balance_run_out_two_weeks" defaultMessage={notification.message} />
      )}
      {notification.message.includes('three weeks') && (
        <FormattedMessage id="balance_run_out_three_weeks" defaultMessage={notification.message} />
      )}
      {notification.message.includes('a month') && (
        <FormattedMessage id="balance_run_out_month" defaultMessage={notification.message} />
      )}
      {notification.message.includes('two months') && (
        <FormattedMessage id="balance_run_out_two_months" defaultMessage={notification.message} />
      )}
      {notification.message.includes('three months') && (
        <FormattedMessage id="balance_run_out_three_months" defaultMessage={notification.message} />
      )}
      {notification.message.includes('Attention!') && (
        <FormattedMessage id="balance_run_out_three_months" defaultMessage={notification.message} />
      )}
      <div className="Notification__text__date">
        <FormattedRelative value={epochToUTC(notification.timestamp)} />
      </div>
    </div>
  </Link>
);

NotificationWebsiteBalance.propTypes = {
  read: PropTypes.bool,
  notification: PropTypes.shape({
    message: PropTypes.string,
    timestamp: PropTypes.number,
  }),
  onClick: PropTypes.func,
  currentAuthUsername: PropTypes.string,
};

NotificationWebsiteBalance.defaultProps = {
  read: false,
  notification: {},
  onClick: () => {},
  currentAuthUsername: '',
};

export default NotificationWebsiteBalance;
