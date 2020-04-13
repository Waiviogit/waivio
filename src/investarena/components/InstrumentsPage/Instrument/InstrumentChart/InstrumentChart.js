import React from 'react';
import PropTypes from 'prop-types';
import { maxBy, minBy, memoize } from 'lodash';
import Chart from 'react-google-charts';

const InstrumentChart = props => {
  const { chart, width, height, noDataMsg, onClick } = props;
  const getMaxValue = memoize(chartData => {
      const point = maxBy(chartData, p => p.y);
      return point && point.y;
    }
  );
  const getMinValue = memoize(chartData => {
      const point = minBy(chartData, p => p.y);
      return point && point.y;
    }
  );
  return chart && chart.length !== 0 ? (
    <div role="presentation" className="st-card__chart" onClick={onClick}>
      <Chart
        width={width}
        height={height}
        chartType="AreaChart"
        data={[['', ''], ...chart]}
        options={{
          backgroundColor: 'transparent',
          colors: ['#3a79ee'],
          chartArea: { left: 0, top: 0, width: '100%', height: '100%' },
          legend: 'none',
          enableInteractivity: false,
          height,
          lineWidth: 1,
          hAxis: {
            baselineColor: 'transparent',
            gridlines: {
              color: 'transparent',
            },
          },
          vAxis: {
            baselineColor: 'transparent',
            gridlines: {
              color: 'transparent',
            },
            viewWindow: {
              max: getMaxValue(chart),
              min: getMinValue(chart),
            },
          },
        }}
      />
    </div>
  ) : (
    <div className="st-assets-chart-no-data">{noDataMsg}</div>
  );
};

InstrumentChart.propTypes = {
  chart: PropTypes.arrayOf(PropTypes.shape()),
  width: PropTypes.number,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  noDataMsg: PropTypes.string,
  onClick: PropTypes.func,
};

InstrumentChart.defaultProps = {
  chart: [],
  width: 250,
  height: 60,
  noDataMsg: 'No data',
  onClick: () => {},
};

export default InstrumentChart;
