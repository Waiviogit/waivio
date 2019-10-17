import React from 'react';
import { injectIntl } from 'react-intl';
import UserAccuracyChart from '../UserAccuracyChart/UserAccuracyChart';
import './UserStatisticContainer.less';
import PropTypes from 'prop-types';

const UserStatisticContainer = ({ intl, contentType, accuracy }) => (
  <div className="UserStatisticContainer">
    <div className="UserStatisticContainer__title">
      {contentType === 'forecast'
        ? intl.formatMessage({
            id: 'user_statistics_forecast_accuracy',
            defaultMessage: 'Forecast accuracy',
          })
        : intl.formatMessage({
            id: 'user_statistics_profitability_per_post',
            defaultMessage: 'Profitability per post',
          })}
    </div>
    <div className="UserStatisticContainer__period">
      <div className="UserStatisticContainer__period-item">
        {contentType === 'forecast' ? <UserAccuracyChart value={accuracy.d1.percent} /> : null}
        <div className="UserStatisticContainer__period-item-value">
          {intl.formatMessage({
            id: 'user_statistics_per_day',
            defaultMessage: 'Per day',
          })}
        </div>
      </div>
      <div className="UserStatisticContainer__period-item border">
        {contentType === 'forecast' ? <UserAccuracyChart value={accuracy.d7.percent} /> : null}
        <div className="UserStatisticContainer__period-item-value">
          {intl.formatMessage({
            id: 'user_statistics_per_week',
            defaultMessage: 'Per week',
          })}
        </div>
      </div>
      <div className="UserStatisticContainer__period-item border">
        {contentType === 'forecast' ? <UserAccuracyChart value={accuracy.m1.percent} /> : null}
        <div className="UserStatisticContainer__period-item-value">
          {intl.formatMessage({
            id: 'user_statistics_per_month',
            defaultMessage: 'Per month',
          })}
        </div>
      </div>
      <div className="UserStatisticContainer__period-item border">
        {contentType === 'forecast' ? <UserAccuracyChart value={accuracy.m12.percent} /> : null}
        <div className="UserStatisticContainer__period-item-value">
          {intl.formatMessage({
            id: 'user_statistics_per_year',
            defaultMessage: 'Per year',
          })}
        </div>
      </div>
    </div>
  </div>
);

UserStatisticContainer.propTypes = {
  intl: PropTypes.string.isRequired,
  contentType: PropTypes.string.isRequired,
  accuracy: PropTypes.string.isRequired,
};

export default injectIntl(UserStatisticContainer);
