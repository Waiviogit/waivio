import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Chart from 'react-google-charts';
import classNames from 'classnames';
import { getAccuracyChartLoaded } from '../../../reducers';
import SkeletonCustom from '../../../components/Skeleton/SkeletonCustom';
import './UserProfitability.less';
import { setAccuracyChartLoaded } from '../../userActions';

const UserProfitability = ({ statisticsData, isChart, dispatchChartLoaded }) => {
  const noData =
    statisticsData.successful_pips === 0 &&
    statisticsData.failed_pips === 0 &&
    statisticsData.neutral_count === 0;

  const options = {
    pieHole: 0.8,
    backgroundColor: 'transparent',
    pieSliceBorderColor: 'transparent',
    slices: [
      {
        color: '#54d2a0',
      },
      {
        color: noData ? '#8798a4' : '#d9534f',
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

  const data = [['neutral_count', statisticsData.neutral_count]];

  return noData ? (
    <div className="UserProfitability">
      {!isChart && (
        <div className="UserProfitability__loader">
          <SkeletonCustom
            className="UserProfitability__loader"
            isLoading={!isChart}
            randomWidth
            rows={2}
            width={50}
          />
        </div>
      )}
      <div className={classNames('UserProfitability__data-wrapper', { hideChart: !isChart })}>
        <div className="UserProfitability__data-wrapper-chart">
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
                  dispatchChartLoaded();
                },
              },
            ]}
          />
        </div>
        <div className="UserProfitability__data-wrapper-value">
          {noData && (
            <div className="neutral_count_pips">{`${statisticsData.neutral_count} pips`}</div>
          )}
        </div>
      </div>
    </div>
  ) : (
    <div
      className={classNames('UserProfitability', {
        success: statisticsData.pips > 0,
        unsuccess: statisticsData.pips < 0,
      })}
    >
      {isChart ? (
        <React.Fragment>
          <div className="UserProfitability">
            <div className="UserProfitability__value">{`${statisticsData.pips}`}</div>
          </div>
          <div className="UserProfitability__profit">pips</div>
        </React.Fragment>
      ) : (
        <SkeletonCustom
          className="UserProfitability__loader"
          isLoading={!isChart}
          randomWidth
          rows={2}
          width={50}
        />
      )}
    </div>
  );
};
UserProfitability.propTypes = {
  statisticsData: PropTypes.shape().isRequired,
  isChart: PropTypes.bool.isRequired,
  dispatchChartLoaded: PropTypes.func.isRequired,
};

export default connect(
  state => ({
    isChart: getAccuracyChartLoaded(state),
  }),
  {
    dispatchChartLoaded: setAccuracyChartLoaded,
  },
)(UserProfitability);
