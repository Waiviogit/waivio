import React from 'react';
import './UserStatistics.less';
import UserAccuracyChart from './UserAccuracyChart/UserAccuracyChart';

const UserStatistics = () => (
  <div className="UserStatistics">
    <div className="UserStatistics__title">Forecast accuracy</div>
    <div className="UserStatistics__accuracy">
      <UserAccuracyChart period={'day'} />
      <div className="UserStatistics__accuracy-item border">
        <UserAccuracyChart period={'week'} />
      </div>
      <div className="UserStatistics__accuracy-item border">
        <UserAccuracyChart period={'month'} />
      </div>
      <div className="UserStatistics__accuracy-item border">
        <UserAccuracyChart period={'year'} />
      </div>
    </div>
  </div>
);

export default UserStatistics;
