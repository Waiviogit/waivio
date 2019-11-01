import React from 'react';
import PropTypes from 'prop-types';
import UserAccuracyContainer from './UserAccuracyContainer/UserAccuracyContainer';
import UserForecastInstruments from './UserForecastInstruments/UserForecastInstruments';
import UserInstrumentsTable from './UserInstrumentsTable/UserInstrumentsTable';
import './UserStatistics.less';
import { isEmpty } from 'lodash';

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
      {isEmpty(forecasts) && isEmpty(accuracy) && (
        <div className="UserStatistics empty-data">
          {intl.formatMessage({
            id: 'user_statistics_no_data',
            defaultMessage: 'There is no statistics data yet',
          })}
        </div>
      )}
    </div>
  );
};

UserStatistics.propTypes = {
  forecasts: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  accuracy: PropTypes.shape().isRequired,
  setSortOptions: PropTypes.func.isRequired,
};

export default UserStatistics;
