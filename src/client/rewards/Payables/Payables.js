import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import _ from 'lodash';
import UserPayableCard from './UserPayableCard/UserPayableCrad';
import './Payables.less';

const Payables = ({ intl }) => {
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
        :
      </div>
      {_.map(fakeUserData, user => (
        <UserPayableCard user={user} />
      ))}
    </div>
  );
};

Payables.propTypes = {
  intl: PropTypes.shape().isRequired,
};

export default injectIntl(Payables);
