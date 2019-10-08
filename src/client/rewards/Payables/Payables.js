import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import _ from 'lodash';
import { getLenders } from '../../../waivioApi/ApiClient';
import './Payables.less';
import Debts from '../Debts/Debts';

const PayablesContainer = ({ userName, currentSteemDollarPrice, filterData, location }) => {
  const payableFilters = {};
  _.map(filterData, f => {
    payableFilters[`${f.filterName}`] = f.value;
  });
  const [lenders, setLenders] = useState({});
  useEffect(() => {
    getLenders({
      sponsor: userName,
      filters: payableFilters,
    })
      .then(data => setLenders(data))
      .catch(e => console.log(e));
  }, [filterData]);
  return (
    <Debts
      userName={userName}
      currentSteemDollarPrice={currentSteemDollarPrice}
      debtObjsData={lenders}
      componentLocation={location.pathname}
    />
  );
};

PayablesContainer.propTypes = {
  location: PropTypes.shape().isRequired,
  userName: PropTypes.string.isRequired,
  currentSteemDollarPrice: PropTypes.number.isRequired,
  filterData: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

PayablesContainer.defaultProps = {
  filterData: [],
};

export default injectIntl(PayablesContainer);
