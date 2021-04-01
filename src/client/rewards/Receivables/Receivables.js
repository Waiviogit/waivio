import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { map } from 'lodash';
import { getLenders } from '../../../waivioApi/ApiClient';
import Debts from '../Debts/Debts';

const ReceivablesContainer = ({
  userName,
  currentSteemPrice,
  filterData,
  location,
  setPayablesFilterValue,
}) => {
  const payableFilters = {};
  map(filterData, f => {
    payableFilters[f.filterName] = f.value;
  });
  const [sponsors, setSponsors] = useState({});
  useEffect(() => {
    getLenders({
      user: userName,
      filters: payableFilters,
    })
      .then(data => {
        setSponsors(data);
      })
      .catch(e => console.log(e));
  }, [filterData, userName]);
  return (
    <Debts
      userName={userName}
      currentSteemPrice={currentSteemPrice}
      debtObjsData={sponsors}
      componentLocation={location.pathname}
      activeFilters={filterData}
      setPayablesFilterValue={setPayablesFilterValue}
    />
  );
};

ReceivablesContainer.propTypes = {
  location: PropTypes.shape().isRequired,
  currentSteemPrice: PropTypes.number.isRequired,
  userName: PropTypes.string.isRequired,
  filterData: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  setPayablesFilterValue: PropTypes.func,
};

ReceivablesContainer.defaultProps = {
  setPayablesFilterValue: () => {},
};

export default injectIntl(ReceivablesContainer);
