import React from 'react';
import { Icon } from 'antd';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import '../ObjectWeightBlock.less';
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
    const { forecasts, intl } = this.props;
    return forecasts && forecasts.length ? (
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
