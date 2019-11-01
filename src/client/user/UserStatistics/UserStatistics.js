import React from 'react';
import PropTypes from 'prop-types';
import UserAccuracyContainer from './UserAccuracyContainer/UserAccuracyContainer';
import UserForecastInstruments from './UserForecastInstruments/UserForecastInstruments';
import UserInstrumentsTable from './UserInstrumentsTable/UserInstrumentsTable';
import './UserStatistics.less';

const UserStatistics = ({ accuracy, forecasts, setSortOptions }) => (
  <div className="UserStatistics">
    <UserAccuracyContainer accuracy={accuracy} contentType={'forecast'} />
    <UserAccuracyContainer accuracy={accuracy} contentType={'profitability'} />
    <UserForecastInstruments forecasts={forecasts} />
    <UserInstrumentsTable forecasts={forecasts} setSortOptions={setSortOptions} />
  </div>
);

UserStatistics.propTypes = {
  forecasts: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  accuracy: PropTypes.shape().isRequired,
  setSortOptions: PropTypes.func.isRequired,
};

export default UserStatistics;
