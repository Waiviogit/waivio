import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

const GroupLastActivity = ({ activity }) => (
  <div>
    <b>
      <FormattedMessage id="activity" defaultMessage="Activity" />:
    </b>{' '}
    <span>{activity / 86400000}</span> ]
    <FormattedMessage id="days_lowercase" defaultMessage="days" />{' '}
  </div>
);

GroupLastActivity.propTypes = {
  activity: PropTypes.number.isRequired,
};
export default GroupLastActivity;
