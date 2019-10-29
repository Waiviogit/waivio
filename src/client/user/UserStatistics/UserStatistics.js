import React, { useEffect, useState } from 'react';
import { injectIntl } from 'react-intl';
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
  const mockAccuracyObj = {
    d1: {
      percent: 89,
      pips: 1222,
      counts: { pos: 24, neg: 51 },
    },
    d7: {
      percent: 38,
      pips: -47,
      counts: { pos: 75, neg: 15 },
    },
    m1: {
      percent: 54,
      pips: 98,
      counts: { pos: 58, neg: 9 },
    },
    m12: {
      percent: 25,
      pips: 1234,
      counts: { pos: 12, neg: 5 },
    },
  };
  const mockInstrumentsObj = [
    { forecastName: 'AUD/CAD', count: 24 },
    { forecastName: 'Apple', count: 45 },
    { forecastName: 'Bitcoin', count: 54 },
  ];
  return (
    <div className="UserStatistics">
      <UserStatisticContainer accuracy={mockAccuracyObj} contentType={'forecast'} />
      <UserStatisticContainer accuracy={statData} contentType={'profitability'} />
      <UserForecastInstruments forecasts={mockInstrumentsObj} />
    </div>
  );
};

export default injectIntl(UserStatistics);
