import React from 'react';
import { injectIntl } from 'react-intl';
import './UserStatistics.less';
import UserAccuracyChart from './UserAccuracyChart/UserAccuracyChart';

const UserStatistics = ({ intl }) => {
  const mockObj = { d1: 10, d7: 2, m1: 31, m12: 51 };
  return (
    <div className="UserStatistics">
      <div className="UserStatistics__title">Forecast accuracy</div>
      <div className="UserStatistics__accuracy">
        <div className="UserStatistics__accuracy-item">
          <UserAccuracyChart value={mockObj.d1} period={'day'} />
        </div>
        <div className="UserStatistics__accuracy-item border">
          <UserAccuracyChart value={mockObj.d7} period={'week'} />
        </div>
        <div className="UserStatistics__accuracy-item border">
          <UserAccuracyChart value={mockObj.m1} period={'month'} />
        </div>
        <div className="UserStatistics__accuracy-item border">
          <UserAccuracyChart value={mockObj.m12} period={'year'} />
        </div>
      </div>
    </div>
  );
};

export default injectIntl(UserStatistics);
