import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import _ from 'lodash';
import UserPayableCard from './UserPayableCard/UserPayableCrad';
import './Payables.less';
import { getLenders } from '../../../waivioApi/ApiClient';

const Payables = ({ intl, userName, currentSteemDollarPrice }) => {
  const [lenders, setLenders] = useState({});
  useEffect(() => {
    getLenders(userName)
      .then(data => setLenders(data))
      .catch(e => console.log(e));
  }, []);
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
};

export default injectIntl(Payables);
