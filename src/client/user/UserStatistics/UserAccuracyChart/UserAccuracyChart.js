import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import classNames from 'classnames';
import { Doughnut } from 'react-chartjs-2';
import 'chartjs-plugin-annotation';
import './UserAccuracyChart.less';

const UserAccuracyChart = ({ value, nightmode }) => {
  const data = {
    labels: [],
    datasets: [
      {
        data: [value, 100 - value],
        backgroundColor: ['#54d2a0', '#d9534f'],
        borderColor: nightmode ? '#24292e' : '#fff',
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
    hover: { mode: null },
    cutoutPercentage: 75,
  };
  return (
    <div className="UserAccuracy">
      <div className="UserAccuracy__chart">
        <Doughnut data={data} options={options} width={30} height={30} />
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
  nightmode: PropTypes.bool.isRequired,
};

export default injectIntl(UserAccuracyChart);
