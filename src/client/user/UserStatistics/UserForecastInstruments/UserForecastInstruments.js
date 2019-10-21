import React from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Pie } from 'react-chartjs-2';
import { getForecastsData } from '../../usersHelper';
import './UserForecastInstruments.less';

const UserForecastInstruments = ({ intl, forecasts, nightmode }) => {
  const forecastsData = getForecastsData(forecasts);

  const data = {
    labels: forecastsData.labels,
    datasets: [
      {
        data: forecastsData.counts,
        backgroundColor: forecastsData.colors,
        borderColor: nightmode ? '#24292e' : '#ffff',
      },
    ],
  };

  const options = {
    legend: {
      position: 'bottom',
      labels: {
        fontColor: nightmode ? '#f2f2f2' : 'rgba(0, 0, 0, 0.65)',
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
        <Pie data={data} options={options} width={60} height={60} />
      </div>
    </div>
  );
};

UserForecastInstruments.propTypes = {
  intl: PropTypes.shape().isRequired,
  forecasts: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  nightmode: PropTypes.bool.isRequired,
};

export default injectIntl(UserForecastInstruments);
