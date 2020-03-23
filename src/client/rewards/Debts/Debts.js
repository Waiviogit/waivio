import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import PaymentCard from '../PaymentCard/PaymentCard';
import './Debts.less';

const Debts = ({ intl, currentSteemDollarPrice, debtObjsData, componentLocation }) => (
  <div className="Debts">
    <div className="Debts__main-title">
      {componentLocation === '/rewards/payables'
        ? intl.formatMessage({
            id: 'debts_receivables',
            defaultMessage: 'Receivables',
          })
        : intl.formatMessage({
            id: 'debts_payables',
            defaultMessage: 'Payables',
          })}
    </div>
    <div className="Debts__information-row">
      <div className="Debts__information-row-total-title">
        {intl.formatMessage({
          id: 'debts_total',
          defaultMessage: 'Total',
        })}
        : {debtObjsData && debtObjsData.payable && debtObjsData.payable.toFixed(2)}
        {' HBD '}
        {currentSteemDollarPrice
          ? `(US$ ${(currentSteemDollarPrice * debtObjsData.payable).toFixed(2)})`
          : ''}
      </div>
      <div className="Debts__information-row-pay">
        <Link to={'/rewards/pay-all'}>
          {intl.formatMessage({
            id: 'debts_pay_all',
            defaultMessage: 'Pay all',
          })}
          (mock)
        </Link>
      </div>
    </div>
    {_.map(debtObjsData.histories, debtObjData => {
      const name =
        componentLocation === '/rewards/payables' ? debtObjData.userName : debtObjData.guideName;
      return (
        <PaymentCard
          key={name}
          name={name}
          payable={debtObjData.payable}
          alias={debtObjData.alias}
          path={`${componentLocation}/@${name}`}
        />
      );
    })}
  </div>
);

Debts.propTypes = {
  intl: PropTypes.shape().isRequired,
  debtObjsData: PropTypes.shape().isRequired,
  currentSteemDollarPrice: PropTypes.number.isRequired,
  componentLocation: PropTypes.string.isRequired,
};

Debts.defaultProps = {
  filterData: [],
};

export default injectIntl(Debts);
