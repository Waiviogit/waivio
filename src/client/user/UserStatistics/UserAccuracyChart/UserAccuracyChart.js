import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Chart from 'react-google-charts';
import classNames from 'classnames';
import { setAccuracyChartLoaded } from '../../userActions';
import { getAccuracyChartLoaded } from '../../../reducers';
import Loading from '../../../components/Icon/Loading';
import './UserAccuracyChart.less';

const UserAccuracyChart = ({ statisticsData, isChart, ...props }) => {
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

  return (
    <div className="UserAccuracy">
      {!isChart && (
        <div className="UserAccuracy__loader">
          <Loading center />
        </div>
      )}
      <div className={classNames('UserAccuracy__data-wrapper', { hideChart: !isChart })}>
        <div className="UserAccuracy__data-wrapper-chart">
          <Chart
            width={'100%'}
            height={'95px'}
            chartType="PieChart"
            data={data}
            options={options}
            chartEvents={[
              {
                eventName: 'ready',
                callback: () => {
                  props.setAccuracyChartLoaded();
                },
              },
            ]}
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
  setForecastAccuracyChartCondition: PropTypes.func.isRequired,
  isChart: PropTypes.bool.isRequired,
  setAccuracyChartLoaded: PropTypes.func.isRequired
};

export default connect(
  state => ({
    isChart: getAccuracyChartLoaded(state),
  }),
  {
    setAccuracyChartLoaded,
  },
)(UserAccuracyChart);
