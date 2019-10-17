import React from 'react';
import { injectIntl } from 'react-intl';
import UserStatisticContainer from './UserStatisticContainer/UserStatisticContainer';
import './UserStatistics.less';
import UserForecastInstruments from './UserForecastInstruments/UserForecastInstruments';

const UserStatistics = () => {
  const mockAccuracyObj = {
    d1: {
      percent: 89,
      pips: 1222,
      counts: { pos: 12, neg: 5 },
    },
    d7: {
      percent: 38,
      pips: -47,
      counts: { pos: 12, neg: 5 },
    },
    m1: {
      percent: 54,
      pips: 98,
      counts: { pos: 12, neg: 5 },
    },
    m12: {
      percent: 24,
      pips: 1234,
      counts: { pos: 12, neg: 5 },
    },
  };
  const mockForecastObj = [
    { forecastName: 'AUD/CAD', count: 24 },
    { forecastName: 'Apple', count: 45 },
    { forecastName: 'Bitcoin', count: 54 },
  ];
  return (
    <div className="UserStatistics">
      <UserStatisticContainer accuracy={mockAccuracyObj} contentType={'forecast'} />
      <UserStatisticContainer accuracy={mockAccuracyObj} contentType={'profitability'} />
      <UserForecastInstruments forecasts={mockForecastObj} />
    </div>
  );
};

export default injectIntl(UserStatistics);
