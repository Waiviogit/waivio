import React from 'react';
import _, {isEmpty} from 'lodash';
import PropTypes from 'prop-types';
import {Icon} from 'antd';
import {injectIntl} from 'react-intl';
import './ForecastBlock.less';
import ForecastItem from '../ForecastItem';

@injectIntl
class ForecastBlock extends React.Component {
  static propTypes = {
    forecastsByObject: PropTypes.arrayOf(PropTypes.shape({})),
    forecastsByUser: PropTypes.arrayOf(PropTypes.shape({})),
    getActiveForecasts: PropTypes.func.isRequired,
    intl: PropTypes.shape(),
    object: PropTypes.shape(),
  };

  static defaultProps = {
    getActiveForecasts: () => {
    },
    intl: {},
    object: {},
    forecastsByObject: [],
    forecastsByUser: [],
  };

  static forecastBlock(intl, forecasts) {
    return (
      <div className="forecasts-block">
        <h4 className="forecasts-block__header">
          <Icon type="rise" className="forecasts-block__header-icon"/>
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
              permlink={forecast.id}
              quoteSecurity={forecast.security}
              recommend={forecast.recommend}
              forecast={forecast.forecast}
              postPrice={forecast.postPrice}
              dateTimeCreate={forecast.created_at}
            />
          ))}
        </div>
      </div>
    );
  }

  componentDidMount() {
    this.props.getActiveForecasts();
  }

  render() {
    const {forecastsByObject, forecastsByUser, intl, object} = this.props;
    if (!isEmpty(object)) {
      const chartId = _.find(object.fields, ['name', 'chartid']);
      console.log('CHART', chartId);
      return chartId && forecastsByObject && forecastsByObject.length
        ? ForecastBlock.forecastBlock(intl, forecastsByObject)
        : null;
    }
    return forecastsByUser && forecastsByUser.length
      ? ForecastBlock.forecastBlock(intl, forecastsByUser)
      : null;
  }
}

export default ForecastBlock;
