import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import { injectIntl } from 'react-intl';
import './ForecastBlock.less';
import './ForecastBlock-nightmode.less';
import ForecastItem from '../ForecastItem/index';

@injectIntl
class ForecastBlock extends React.Component {
  static propTypes = {
    getActiveForecasts: PropTypes.func,
    forecasts: PropTypes.shape(),
    intl: PropTypes.shape(),
  };

  static defaultProps = {
    getActiveForecasts: () => {},
    forecasts: {},
    intl: {},
  };

  componentDidMount() {
    this.props.getActiveForecasts();
  }

  render() {
    console.log('PROPS', this.props);
    const { forecasts, intl, object } = this.props;
    const chartId = _.find(object.fields, ['name', 'chartid']);
    return chartId && forecasts && forecasts.length ? (
      <div className="forecasts-block">
        <h4 className="forecasts-block__header">
          <Icon type="rise" className="forecasts-block__header-icon" />
          <span>
            {intl.formatMessage({
              id: 'forecast.currentForecast',
              defaultMessage: 'Current forecasts',
            })}
          </span>
        </h4>
        <div className="forecasts-block__content">
          {forecasts.slice(0, 5).map(forecast => (
            <ForecastItem
              key={forecast.id}
              quoteSecurity={forecast.security}
              recommend={forecast.recommend}
              forecast={forecast.forecast}
              postPrice={forecast.postPrice}
              dateTimeCreate={forecast.created_at}
            />
          ))}
        </div>
      </div>
    ) : null;
  }
}

export default ForecastBlock;
