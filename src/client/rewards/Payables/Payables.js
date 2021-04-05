import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { get, size, reduce } from 'lodash';
import { getLenders } from '../../../waivioApi/ApiClient';
import Debts from '../Debts/Debts';

const PayablesContainer = ({
  userName,
  currentSteemDollarPrice,
  filterData,
  location,
  setPayablesFilterValue,
}) => {
  const [lenders, setLenders] = useState({});
  const [loading, setLoading] = useState(false);
  const payableFilters = reduce(
    filterData,
    (acc, f) => {
      acc[f.filterName] = f.value;

      return acc;
    },
    {},
  );

  useEffect(() => {
    setLoading(true);
    getLenders(
      {
        sponsor: userName,
        filters: payableFilters,
      },
      0,
      15,
    )
      .then(data => {
        setLenders(data);
        setLoading(false);
      })
      .catch(e => console.log(e));
  }, [filterData]);

  const handleLoadingMore = () =>
    getLenders(
      {
        sponsor: userName,
        filters: payableFilters,
      },
      size(lenders.histories),
      10,
    ).then(data => {
      setLenders({
        ...lenders,
        histories: [...get(lenders, 'histories', []), ...data.histories],
        hasMore: data.hasMore,
      });
    });

  return (
    <Debts
      userName={userName}
      currentSteemDollarPrice={currentSteemDollarPrice}
      debtObjsData={lenders}
      componentLocation={location.pathname}
      activeFilters={filterData}
      setPayablesFilterValue={setPayablesFilterValue}
      handleLoadingMore={handleLoadingMore}
      loading={loading}
    />
  );
};

PayablesContainer.propTypes = {
  location: PropTypes.shape().isRequired,
  userName: PropTypes.string.isRequired,
  currentSteemDollarPrice: PropTypes.number,
  filterData: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  setPayablesFilterValue: PropTypes.func,
};

PayablesContainer.defaultProps = {
  setPayablesFilterValue: () => {},
  currentSteemDollarPrice: 0,
};

export default injectIntl(PayablesContainer);
