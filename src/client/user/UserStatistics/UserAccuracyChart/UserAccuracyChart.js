import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import classNames from 'classnames';
import { Doughnut } from 'react-chartjs-2';
import 'chartjs-plugin-annotation';
import './UserAccuracyChart.less';

const UserAccuracyChart = ({ value }) => {
  const data = {
    labels: [],
    datasets: [
      {
        data: [value, 100 - value],
        backgroundColor: ['#54d2a0', '#d9534f'],
      },
    ],
  };
  const options = {
    legend: {
      display: false,
    },
    tooltips: {
      enabled: false,
    },
    cutoutPercentage: 80,
  };
  return (
    <div className="UserAccuracyChart">
      <Doughnut data={data} options={options} width={'30%'} height={'30%'} />
      <div
        className={classNames('UserAccuracyChart__value', {
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
