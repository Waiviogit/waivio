import React, {useEffect, useState} from 'react';
import {injectIntl} from 'react-intl';
import {isEmpty} from 'lodash';
import UserStatisticContainer from './UserStatisticContainer/UserStatisticContainer';
import UserForecastInstruments from './UserForecastInstruments/UserForecastInstruments';
import api from '../../../investarena/configApi/apiResources';
import './UserStatistics.less';
import UserInstrumentsTable from './UserInstrumentsTable/UserInstrumentsTable';

const UserStatistics = ({match}) => {
  const [statAccuracyData, setStatAccuracyData] = useState({});
  const [sortOptions, setSortOptions] = useState({});
  const [statInstrumentsData, setStatInstrumentsData] = useState({});

  const parseOption = () => {
    const parsedOptions = {};
    if (!isEmpty(sortOptions)) {

      parsedOptions.sortDirection = sortOptions.isActive ? -1 : 1;
      parsedOptions.sortBy = sortOptions.currentItem;
    }
    return parsedOptions;
  };

  useEffect(() => {
    const instrumentsSortOptions = parseOption();
    api.statistics
      .getUserStatistics(match.params.name)
      .then(response => setStatAccuracyData(response.data));
    api.statistics
      .getUserInstrumentStatistics(match.params.name, instrumentsSortOptions)
      .then(response => setStatInstrumentsData(response.data));
  }, [sortOptions]);
  return (
    <div className="UserStatistics">
      {!isEmpty(statAccuracyData) && (
        <React.Fragment>
          <UserStatisticContainer accuracy={statAccuracyData} contentType={'forecast'}/>
          <UserStatisticContainer accuracy={statAccuracyData} contentType={'profitability'}/>
        </React.Fragment>
      )}
      {!isEmpty(statInstrumentsData) && (
        <React.Fragment>
          <UserForecastInstruments forecasts={statInstrumentsData}/>
          <UserInstrumentsTable forecasts={statInstrumentsData} setSortOptions={setSortOptions}/>
        </React.Fragment>
      )}
    </div>
  );
};

export default injectIntl(UserStatistics);
