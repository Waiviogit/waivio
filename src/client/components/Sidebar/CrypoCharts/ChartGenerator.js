import React, { useState, Suspense, lazy } from 'react';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { getLocale } from '../../../../store/settingsStore/settingsSelectors';
import USDDisplay from '../../Utils/USDDisplay';

// Lazy load LineChart to avoid blocking the app if react-easy-chart has issues
const LineChart = lazy(() => 
  import('react-easy-chart').then(module => ({ default: module.LineChart })).catch(() => ({
    default: () => <div className="chart-error">Chart unavailable</div>
  }))
);

const ChartGenerator = props => {
  const [chartConfig, setChartConfig] = useState({
    chartWidth: 280,
    showTooltip: false,
    top: '0px',
    left: '0px',
    y: 0,
    x: 0,
  });

  const chartMouseOverHandler = (data, event) => {
    setChartConfig({
      ...chartConfig,
      showTooltip: true,
      left: `${event.x - 30}px`,
      top: `${event.y - 35}px`,
      x: data.x,
      y: data.y,
    });
  };

  const chartMouseOutHandler = () => {
    setChartConfig({
      ...chartConfig,
      showTooltip: false,
    });
  };

  if (isEmpty(props.prices)) return null;

  const graphData = props.prices.map(price => ({ x: price.day, y: price.price })).reverse();
  const config = {
    width: props.width,
    height: 100,
    margin: { top: 20, right: 36, bottom: 30, left: 30 },
    axes: true,
    xType: 'text',
    yTicks: 0,
    data: [graphData],
    dataPoints: true,
    mouseOverHandler: chartMouseOverHandler,
    mouseOutHandler: chartMouseOutHandler,
  };

  return (
    <div>
      <Suspense fallback={<div className="chart-loading">Loading chart...</div>}>
        <LineChart {...config} />
      </Suspense>
      {chartConfig.showTooltip && (
        <p className="linechart-tooltip" style={{ top: chartConfig.top, left: chartConfig.left }}>
          {chartConfig.x}: <USDDisplay value={chartConfig.y} currencyDisplay={'symbol'} />
        </p>
      )}
    </div>
  );
};

ChartGenerator.propTypes = {
  prices: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  width: PropTypes.string.isRequired,
  locale: PropTypes.string.isRequired,
};

export default connect(state => ({
  locale: getLocale(state),
}))(ChartGenerator);
