import React from 'react';
import { injectIntl } from 'react-intl';
// import { map } from 'lodash';
import PropTypes from 'prop-types';
import './UserForecastInstruments.less';

const UserForecastInstruments = ({ intl }) => {
  // const chartData = map(forecasts, forecast => ({
  //   key: `${forecast.forecastName}`,
  //   value: forecast.count,
  // }));
  return (
    <div className="UserForecastInstruments">
      <div className="UserForecastInstruments__title">
        {intl.formatMessage({
          id: 'user_statistics_forecast_instruments',
          defaultMessage: 'Forecasts by instruments',
        })}
      </div>
      <div>
        {/*<PieChart size={500} labels data={chartData} />*/}
        {/*<Legend data={chartData} dataId={'key'} />*/}
      </div>
    </div>
  );
};

UserForecastInstruments.propTypes = {
  intl: PropTypes.shape().isRequired,
  forecasts: PropTypes.shape().isRequired,
};

export default injectIntl(UserForecastInstruments);
