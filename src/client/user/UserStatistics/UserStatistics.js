import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import UserAccuracyContainer from './UserAccuracyContainer/UserAccuracyContainer';
import UserForecastInstruments from './UserForecastInstruments/UserForecastInstruments';
import UserInstrumentsTable from './UserInstrumentsTable/UserInstrumentsTable';
import './UserStatistics.less';

const UserStatistics = ({ accuracy, forecasts, setSortOptions }) => {
  return (
    <div className="UserStatistics">
      {!isEmpty(accuracy) && (
        <React.Fragment>
          <UserAccuracyContainer accuracy={accuracy} contentType={'forecast'} />
          <UserAccuracyContainer accuracy={accuracy} contentType={'profitability'} />
        </React.Fragment>
      )}
      {!isEmpty(forecasts) && (
        <React.Fragment>
          <UserForecastInstruments forecasts={forecasts} />
          <UserInstrumentsTable forecasts={forecasts} setSortOptions={setSortOptions} />
        </React.Fragment>
      )}
    </div>
  );
};

UserStatistics.propTypes = {
  forecasts: PropTypes.shape().isRequired,
  accuracy: PropTypes.shape().isRequired,
  setSortOptions: PropTypes.func.isRequired,
};

export default UserStatistics;
