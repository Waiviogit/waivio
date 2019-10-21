import React from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Pie } from 'react-chartjs-2';
import 'chartjs-plugin-annotation';
import { getForecastsData } from '../../usersHelper';
import './UserForecastInstruments.less';

const UserForecastInstruments = ({ intl, forecasts }) => {
  const forecastsData = getForecastsData(forecasts);

  const data = {
    labels: forecastsData.labels,
    datasets: [
      {
        data: forecastsData.counts,
        backgroundColor: forecastsData.colors,
      },
    ],
  };

  const options = {
    legend: {
      position: 'bottom',
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
      <div>
        <Pie data={data} options={options} width={'100%'} />
      </div>
    </div>
  );
};

UserForecastInstruments.propTypes = {
  intl: PropTypes.shape().isRequired,
  forecasts: PropTypes.shape().isRequired,
};

export default injectIntl(UserForecastInstruments);
