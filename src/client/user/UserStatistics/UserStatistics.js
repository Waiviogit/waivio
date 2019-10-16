import React from 'react';
import { injectIntl } from 'react-intl';
import UserAccuracyChart from './UserAccuracyChart/UserAccuracyChart';
import './UserStatistics.less';

const UserStatistics = ({ intl }) => {
  const mockObj = {
    d1: {
      percent: 89,
      pips: 1222,
      counts: { pos: 12, neg: 5 },
    },
    d7: {
      percent: 38,
      pips: 1222,
      counts: { pos: 12, neg: 5 },
    },
    m1: {
      percent: 54,
      pips: 1222,
      counts: { pos: 12, neg: 5 },
    },
    m12: {
      percent: 24,
      pips: 1222,
      counts: { pos: 12, neg: 5 },
    },
  };
  return (
    <div className="UserStatistics">
      <div className="UserStatistics__title">
        {intl.formatMessage({
          id: 'user_statistics_forecast_accuracy',
          defaultMessage: 'Forecast accuracy',
        })}
      </div>
      <div className="UserStatistics__accuracy">
        <div className="UserStatistics__accuracy-item">
          <UserAccuracyChart value={mockObj.d1.percent} period={'day'} />
        </div>
        <div className="UserStatistics__accuracy-item border">
          <UserAccuracyChart value={mockObj.d7.percent} period={'week'} />
        </div>
        <div className="UserStatistics__accuracy-item border">
          <UserAccuracyChart value={mockObj.m1.percent} period={'month'} />
        </div>
        <div className="UserStatistics__accuracy-item border">
          <UserAccuracyChart value={mockObj.m12.percent} period={'year'} />
        </div>
      </div>
    </div>
  );
};

export default injectIntl(UserStatistics);
