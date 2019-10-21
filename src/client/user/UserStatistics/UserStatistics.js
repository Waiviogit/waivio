import React from 'react';
import { useSelector } from 'react-redux';
import { injectIntl } from 'react-intl';
import UserStatisticContainer from './UserStatisticContainer/UserStatisticContainer';
import UserForecastInstruments from './UserForecastInstruments/UserForecastInstruments';
import './UserStatistics.less';


const UserStatistics = () => {
  const isNightmode = useSelector(state => state.settings.nightmode);
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
      <UserStatisticContainer
        accuracy={mockAccuracyObj}
        contentType={'forecast'}
        nightmode={isNightmode}
      />
      <UserStatisticContainer
        accuracy={mockAccuracyObj}
        contentType={'profitability'}
        nightmode={isNightmode}
      />
      <UserForecastInstruments forecasts={mockInstrumentsObj} nightmode={isNightmode} />
    </div>
  );
};

export default injectIntl(UserStatistics);
