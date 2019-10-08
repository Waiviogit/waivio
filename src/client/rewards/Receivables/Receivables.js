import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import _ from 'lodash';
import { getLenders } from '../../../waivioApi/ApiClient';
import './Receivables.less';
import Debts from '../Debts/Debts';

const ReceivablesContainer = ({ userName, currentSteemDollarPrice, filterData, location }) => {
  const payableFilters = {};
  _.map(filterData, f => {
    payableFilters[`${f.filterName}`] = f.value;
  });
  const [sponsors, setSponsors] = useState({});
  useEffect(() => {
    getLenders({
      sponsor: '',
      user: userName,
      filters: payableFilters,
    })
      .then(data => setSponsors(data))
      .catch(e => console.log(e));
  }, [filterData]);
  return (
    <Debts
      userName={userName}
      currentSteemDollarPrice={currentSteemDollarPrice}
      debtObjsData={sponsors}
      componentLocation={location.pathname}
    />
  );
};

ReceivablesContainer.propTypes = {
  location: PropTypes.shape().isRequired,
  currentSteemDollarPrice: PropTypes.number.isRequired,
  userName: PropTypes.string.isRequired,
  filterData: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

ReceivablesContainer.defaultProps = {
  filterData: [],
};

export default injectIntl(ReceivablesContainer);
