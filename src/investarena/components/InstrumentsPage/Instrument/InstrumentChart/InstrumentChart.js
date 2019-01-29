import React from 'react';
import PropTypes from 'prop-types';
import { AreaChart } from 'react-easy-chart';

const InstrumentChart = props => {
  const { chart, width, height, noDataMsg, onClick } = props;
  return (
    chart && chart.length !== 0
      ? (
        <div role='presentation' className="st-card__chart" onClick={onClick}>
          <AreaChart
            width={width}
            height={height}
            areaColors={['#3a79ee']}
            data={[chart]}
          />
        </div>
      ) : (
        <div className="st-assets-chart-no-data">
          {noDataMsg}
        </div>
      )
  );
};

InstrumentChart.propTypes = {
  chart: PropTypes.arrayOf(PropTypes.shape()),
  width: PropTypes.number,
  height: PropTypes.oneOfType(PropTypes.string, PropTypes.number),
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
