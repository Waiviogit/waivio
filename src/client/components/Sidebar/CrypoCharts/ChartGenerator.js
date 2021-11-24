import React, { useState } from 'react';
import { connect } from 'react-redux';
import { LineChart } from 'react-easy-chart';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';

import { getIsMobile } from '../../../../store/appStore/appSelectors';
import { getLocale } from '../../../../store/settingsStore/settingsSelectors';
import USDDisplay from '../../Utils/USDDisplay';

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
    mouseOverHandler: !props.isMobile ? chartMouseOverHandler : () => {},
    mouseOutHandler: !props.isMobile ? chartMouseOutHandler : () => {},
  };

  return (
    <div>
      <LineChart {...config} />
      {chartConfig.showTooltip && (
        <p className="linechart-tooltip" style={{ top: chartConfig.top, left: chartConfig.left }}>
          {chartConfig.x}: <USDDisplay value={chartConfig.y} currencyDisplay={'symbol'} />
        </p>
      )}
    </div>
  );
};

ChartGenerator.propTypes = {
  prices: PropTypes.arrayOf().isRequired,
  width: PropTypes.string.isRequired,
  locale: PropTypes.string.isRequired,
  isMobile: PropTypes.string.isRequired,
};

export default connect(state => ({
  locale: getLocale(state),
  isMobile: getIsMobile(state),
}))(ChartGenerator);
