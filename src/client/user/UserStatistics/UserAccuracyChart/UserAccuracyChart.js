import React from 'react';
import { PieChart } from 'react-easy-chart';
import './UserAccuracyChart.less';

const UserAccuracyChart = ({ period }) => {
  return (
    <div className="UserStatistics__accuracy-day">
      <PieChart
        size={100}
        innerHoleSize={80}
        data={[
          { key: `A${period}`, value: 100, color: '#54d2a0' },
          { key: `B${period}`, value: 200, color: '#d9534f' },
        ]}
      />
    </div>
  );
};

UserAccuracyChart.propTypes = {
  period: PropTypes.string.isRequired,
};

export default UserAccuracyChart;
