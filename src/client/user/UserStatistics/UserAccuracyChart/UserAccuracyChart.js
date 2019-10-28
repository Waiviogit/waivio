import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { PieChart, Pie } from 'recharts';
import classNames from 'classnames';
import './UserAccuracyChart.less';

const UserAccuracyChart = ({ value }) => {
  const data = [
    { name: 'unsuccess', value: 100 - value, fill: '#d9534f' },
    { name: 'success', value: value, fill: '#54d2a0' },
  ];
  return (
    <div className="UserAccuracy">
      <div className="UserAccuracy__chart">
        <PieChart width={95} height={95}>
          <Pie data={data} innerRadius={35} outerRadius={45} stroke="transparent"/>
        </PieChart>
      </div>
      <div
        className={classNames('UserAccuracy__value', {
          success: value > 50,
          unsuccess: value < 50,
        })}
      >{`${value}%`}</div>
    </div>
  );
};

UserAccuracyChart.propTypes = {
  value: PropTypes.number.isRequired,
};

export default injectIntl(UserAccuracyChart);
