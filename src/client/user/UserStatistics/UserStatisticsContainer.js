import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { intersectionBy, forEach, isEmpty } from 'lodash';
import api from '../../../investarena/configApi/apiResources';
import UserStatistics from './UserStatistics';

const UserStatisticsContainer = ({ match }) => {
  const [statAccuracyData, setStatAccuracyData] = useState({});
  const [sortOptions, setSortOptions] = useState({});
  const [statInstrumentsData, setStatInstrumentsData] = useState({});
  const quotes = useSelector(state => state.quotesSettings);
  const parseOption = () => {
    const parsedOptions = {};
    if (!isEmpty(sortOptions)) {
      parsedOptions.sortDirection = sortOptions.isActive ? -1 : 1;
      parsedOptions.sortBy = sortOptions.currentItem;
    }
    return parsedOptions;
  };

  const prepareInstrumentsData = (quotes, statData) => {
    const parseQuotes = [];
    forEach(quotes, q => {
      q.quote = q.keyName;
      parseQuotes.push(q);
    });
    return intersectionBy(statData, parseQuotes, 'quote');
  };

  const parsedInstrumentsData =
    quotes && !isEmpty(statInstrumentsData)
      ? prepareInstrumentsData(quotes, statInstrumentsData)
      : [];

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
    <React.Fragment>
      {statAccuracyData && statInstrumentsData && (
        <UserStatistics
          accuracy={statAccuracyData}
          forecasts={parsedInstrumentsData}
          setSortOptions={setSortOptions}
        />
      )}
    </React.Fragment>
  );
};

UserStatisticsContainer.propTypes = {
  match: PropTypes.shape().isRequired,
};

export default UserStatisticsContainer;
