import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import _ from 'lodash';
import UserPayableCard from './UserPayableCard/UserPayableCrad';
import './Payables.less';
import { getLenders } from '../../../waivioApi/ApiClient';

const Payables = ({ intl, userName, currentSteemDollarPrice, filterData }) => {
  const payableFilters = {};
  _.map(filterData, f => {
    if (f.value === 15) {
      payableFilters.days = 15;
    }
    if (f.value === 10) {
      payableFilters.payable = 10;
    }
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
  const fakeUserData = [{ userName: 'siamcat', aliasName: 'TasteemFundationWeKu', debt: 13.1 }];
  return (
    <div className="Payables">
      <div className="Payables__title">
        {intl.formatMessage({
          id: 'payables_page_payables',
          defaultMessage: 'Payables',
        })}
      </div>
      <div className="Payables__total-title">
        {intl.formatMessage({
          id: 'payables_page_total',
          defaultMessage: 'Total',
        })}
        : {lenders && lenders.payable && lenders.payable.toFixed(2)}{' '}
        {intl.formatMessage({
          id: 'payables_sbd',
          defaultMessage: 'SBD',
        })}{' '}
        {`(US$ ${(currentSteemDollarPrice * lenders.payable).toFixed(2)})`}
      </div>
      {_.map(fakeUserData, user => (
        <UserPayableCard user={user} />
      ))}
      {_.map(lenders.histories, user => (
        <UserPayableCard user={user} />
      ))}
    </div>
  );
};

Payables.propTypes = {
  intl: PropTypes.shape().isRequired,
  userName: PropTypes.string.isRequired,
  currentSteemDollarPrice: PropTypes.number.isRequired,
  filterData: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

export default injectIntl(Payables);
