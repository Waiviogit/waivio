import React from 'react';
import { PieChart } from 'react-easy-chart';
import PropTypes from 'prop-types';
import './UserAccuracyChart.less';

const UserAccuracyChart = ({ period }) => {
  return (
    <div className="UserAccuracyChart">
      <PieChart
        size={100}
        innerHoleSize={80}
        data={[
          { key: `A${period}`, value: 100, color: '#54d2a0' },
          { key: `B${period}`, value: 200, color: '#d9534f' },
        ]}
      />
      <div className="UserAccuracyChart__value">5%</div>
      <div className="UserAccuracyChart__period">{`per ${period}`}</div>
    </div>
  );
};

UserAccuracyChart.propTypes = {
  period: PropTypes.string.isRequired,
};

export default UserAccuracyChart;
