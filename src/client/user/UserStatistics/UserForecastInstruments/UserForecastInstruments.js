import React from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import Chart from 'react-google-charts';
import { prepareData } from '../../usersHelper';
import './UserForecastInstruments.less';

const UserForecastInstruments = ({ intl, forecasts }) => {
  const forecastsData = prepareData(forecasts);
  const options = {
    pieSliceText: 'none',
    backgroundColor: 'transparent',
    pieSliceBorderColor: 'transparent',
    chartArea: {
      left: 0,
      top: 20,
      width: '100%',
      height: '80%',
    },
    legend: {
      position: 'bottom',
      alignment: 'center',
      textStyle: {
        color: '#99aab5',
        fontSize: 14,
      },
    },
  };

  return (
    <div className="UserForecastInstruments">
      <div className="UserForecastInstruments__title">
        {intl.formatMessage({
          id: 'user_statistics_forecast_instruments',
          defaultMessage: 'Forecasts by instruments',
        })}
      </div>
      <div className="UserForecastInstruments__chart">
        <Chart
          width={'500px'}
          height={'400px'}
          chartType="PieChart"
          data={forecastsData}
          options={options}
        />
      </div>
    </div>
  );
};

UserForecastInstruments.propTypes = {
  intl: PropTypes.shape().isRequired,
  forecasts: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default injectIntl(UserForecastInstruments);
