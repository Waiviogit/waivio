import React from 'react';
import { injectIntl } from 'react-intl';
import UserAccuracyChart from '../UserAccuracyChart/UserAccuracyChart';
import './UserForecastAccuracy.less';

const UserForecastAccuracy = ({ intl, accuracy }) => (
  <div className="UserForecastAccuracy">
    <div className="UserForecastAccuracy__title">
      {intl.formatMessage({
        id: 'user_statistics_forecast_accuracy',
        defaultMessage: 'Forecast accuracy',
      })}
    </div>
    <div className="UserForecastAccuracy__accuracy">
      <div className="UserForecastAccuracy__accuracy-item">
        <UserAccuracyChart value={accuracy.d1.percent} period={'day'} />
      </div>
      <div className="UserForecastAccuracy__accuracy-item border">
        <UserAccuracyChart value={accuracy.d7.percent} period={'week'} />
      </div>
      <div className="UserForecastAccuracy__accuracy-item border">
        <UserAccuracyChart value={accuracy.m1.percent} period={'month'} />
      </div>
      <div className="UserForecastAccuracy__accuracy-item border">
        <UserAccuracyChart value={accuracy.m12.percent} period={'year'} />
      </div>
    </div>
  </div>
);

export default injectIntl(UserForecastAccuracy);
