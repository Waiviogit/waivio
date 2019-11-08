import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import Chart from 'react-google-charts';
import classNames from 'classnames';
import './UserAccuracyChart.less';
import Loading from '../../../components/Icon/Loading';

const UserAccuracyChart = ({ statisticsData }) => {
  const chartRef = useRef(null);
  const percent =
    statisticsData.successful_count === 0
      ? 0
      : parseInt(
          (100 * statisticsData.successful_count) /
            (statisticsData.successful_count + statisticsData.failed_count),
          10,
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

  const isChartLoaded =
    chartRef.current && chartRef.current.state && chartRef.current.state.loadingStatus === 'ready';

  return (
    <div className="UserAccuracy">
      {!isChartLoaded && (
        <div className="UserAccuracy__loader">
          <Loading center />
        </div>
      )}
      <div className={classNames('UserAccuracy__data-wrapper', { hideChart: !isChartLoaded })}>
        <div className="UserAccuracy__data-wrapper-chart">
          <Chart
            ref={chartRef}
            width={'100%'}
            height={'95px'}
            chartType="PieChart"
            data={data}
            options={options}
          />
        </div>
        <div
          className={classNames('UserAccuracy__data-wrapper-value', {
            success: percent >= 50,
            unsuccess: percent < 50,
          })}
        >{`${percent}%`}</div>
      </div>
    </div>
  );
};

UserAccuracyChart.propTypes = {
  statisticsData: PropTypes.shape().isRequired,
};

export default injectIntl(UserAccuracyChart);
