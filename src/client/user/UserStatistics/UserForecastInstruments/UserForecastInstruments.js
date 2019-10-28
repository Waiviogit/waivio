import React from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
// import { Pie } from 'react-chartjs-2';
// import { prepareForecastsData } from '../../usersHelper';
import './UserForecastInstruments.less';

const UserForecastInstruments = ({ intl }) => {
  // const forecastsData = prepareForecastsData(forecasts);

  // const data = {
  //   labels: forecastsData.labels,
  //   datasets: [
  //     {
  //       data: forecastsData.counts,
  //       backgroundColor: forecastsData.colors,
  //       borderColor: 'transparent',
  //     },
  //   ],
  // };

  // const options = {
  //   legend: {
  //     position: 'bottom',
  //     labels: {
  //       fontColor: '#99aab5',
  //     },
  //   },
  //   maintainAspectRatio: false,
  // };

  return (
    <div className="UserForecastInstruments">
      <div className="UserForecastInstruments__title">
        {intl.formatMessage({
          id: 'user_statistics_forecast_instruments',
          defaultMessage: 'Forecasts by instruments',
        })}
      </div>
      <div className="UserForecastInstruments__chart">
        {/* <Pie data={data} options={options} width={300} height={300} /> */}
      </div>
    </div>
  );
};

UserForecastInstruments.propTypes = {
  intl: PropTypes.shape().isRequired,
  forecasts: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default injectIntl(UserForecastInstruments);
