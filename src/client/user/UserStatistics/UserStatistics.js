import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { isEmpty } from 'lodash';
import UserAccuracyContainer from './UserAccuracyContainer/UserAccuracyContainer';
import UserForecastInstruments from './UserForecastInstruments/UserForecastInstruments';
import UserInstrumentsTable from './UserInstrumentsTable/UserInstrumentsTable';
import './UserStatistics.less';

const UserStatistics = ({ accuracy, forecasts, setSortOptions, intl }) => {
  const [isLoadedChart, setLoadedChart] = useState(false);
  return (
    <div className="UserStatistics">
      {!isEmpty(accuracy) && (
        <React.Fragment>
          <UserAccuracyContainer
            accuracy={accuracy}
            contentType={'forecast'}
            setLoadedChart={setLoadedChart}
          />
          <UserAccuracyContainer
            accuracy={accuracy}
            contentType={'profitability'}
            isLoadedChart={isLoadedChart}
          />
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
  intl: PropTypes.shape().isRequired,
  forecasts: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  accuracy: PropTypes.shape().isRequired,
  setSortOptions: PropTypes.func.isRequired,
};

export default injectIntl(UserStatistics);
