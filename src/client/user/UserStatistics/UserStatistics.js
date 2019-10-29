import React, { useEffect, useState } from 'react';
import { injectIntl } from 'react-intl';
import { isEmpty } from 'lodash';
import UserStatisticContainer from './UserStatisticContainer/UserStatisticContainer';
import UserForecastInstruments from './UserForecastInstruments/UserForecastInstruments';
import api from '../../../investarena/configApi/apiResources';
import './UserStatistics.less';

const UserStatistics = ({ match }) => {
  const [statData, setStatData] = useState({});
  useEffect(() => {
    api.statistics
      .getUserStatistics(match.params.name)
      .then(response => setStatData(response.data));
  }, []);
  const mockInstrumentsObj = [
    { forecastName: 'AUD/CAD', count: 24 },
    { forecastName: 'Apple', count: 45 },
    { forecastName: 'Bitcoin', count: 54 },
  ];
  return (
    <div className="UserStatistics">
      {!isEmpty(statData) && (
        <UserStatisticContainer accuracy={statData} contentType={'forecast'} />
      )}
      {!isEmpty(statData) && (
        <UserStatisticContainer accuracy={statData} contentType={'profitability'} />
      )}
      <UserForecastInstruments forecasts={mockInstrumentsObj} />
    </div>
  );
};

export default injectIntl(UserStatistics);
