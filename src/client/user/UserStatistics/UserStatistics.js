import React, { useEffect, useState } from 'react';
import { injectIntl } from 'react-intl';
import { isEmpty } from 'lodash';
import UserStatisticContainer from './UserStatisticContainer/UserStatisticContainer';
import UserForecastInstruments from './UserForecastInstruments/UserForecastInstruments';
import api from '../../../investarena/configApi/apiResources';
import './UserStatistics.less';
import UserInstrumentsTable from './UserInstrumentsTable/UserInstrumentsTable';

const UserStatistics = ({ match }) => {
  const [statAccuracyData, setStatAccuracyData] = useState({});
  const [sortOptions, setSortOptions] = useState({});
  const [statInstrumentsData, setStatInstrumentsData] = useState({});

  const parseOption = () => {
    const sortOption = {};
    if (!isEmpty(sortOptions)) {
      sortOption.sortDirection = sortOptions.isActive ? -1 : 1;
      sortOption.sortBy = sortOptions.currentItem;
    }
    return sortOption;
  };

  parseOption();
  useEffect(() => {
    api.statistics
      .getUserStatistics(match.params.name)
      .then(response => setStatAccuracyData(response.data));
    api.statistics
      .getUserInstrumentStatistics(match.params.name)
      .then(response => setStatInstrumentsData(response.data));
  }, [sortOptions]);
  const mockInstrumentsData = [
    { forecastName: 'AUD/CAD', count: 24, pips: 34 },
    { forecastName: 'Apple', count: 45, pips: 41 },
    { forecastName: 'Bitcoin', count: 54, pips: 62 },
  ];
  return (
    <div className="UserStatistics">
      {!isEmpty(statAccuracyData) && (
        <React.Fragment>
          <UserStatisticContainer accuracy={statAccuracyData} contentType={'forecast'} />
          <UserStatisticContainer accuracy={statAccuracyData} contentType={'profitability'} />
        </React.Fragment>
      )}
      {!isEmpty(statInstrumentsData) && <UserForecastInstruments forecasts={statInstrumentsData} />}
      <UserInstrumentsTable forecasts={mockInstrumentsData} setSortOptions={setSortOptions} />
    </div>
  );
};

export default injectIntl(UserStatistics);
