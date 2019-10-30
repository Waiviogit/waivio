import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import Chart from 'react-google-charts';
import classNames from 'classnames';
import './UserAccuracyChart.less';

const UserAccuracyChart = ({ statisticsData }) => {
  const percent = parseInt(
    (100 * statisticsData.successful_count) /
      (statisticsData.successful_count + statisticsData.failed_count),
  );
  const data = [['', ''], ['success', percent], ['unsuccess', 100 - percent]];
  const options = {
    pieHole: 0.75,
    backgroundColor: 'transparent',
    pieSliceBorderColor: 'transparent',
    slices: [
      {
        color: '#54d2a0',
      },
      {
        color: '#d9534f',
      },
    ],
    enableInteractivity: false,
    tooltip: 'none',
    legend: 'none',
    pieSliceText: 'none',
    chartArea: {
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
    },
  };
  return (
    <div className="UserAccuracy">
      <div className="UserAccuracy__chart">
        <Chart width={'100%'} height={'95px'} chartType="PieChart" data={data} options={options} />
      </div>
      <div
        className={classNames('UserAccuracy__value', {
          success: percent > 50,
          unsuccess: percent < 50,
        })}
      >{`${percent}%`}</div>
    </div>
  );
};

UserAccuracyChart.propTypes = {
  statisticsData: PropTypes.shape().isRequired,
};

export default injectIntl(UserAccuracyChart);
