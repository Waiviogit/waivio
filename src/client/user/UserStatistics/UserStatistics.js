import React from 'react';
import './UserStatistics.less';
import UserAccuracyChart from './UserAccuracyChart/UserAccuracyChart';

const UserStatistics = () => (
  <div className="UserStatistics">
    <div className="UserStatistics__title">Forecast accuracy</div>
    <div className="UserStatistics__accuracy">
      <UserAccuracyChart period={'day'} />
      <UserAccuracyChart period={'week'} />
      <UserAccuracyChart period={'month'} />
      <UserAccuracyChart period={'year'} />
    </div>
  </div>
);

export default UserStatistics;
