import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import PaymentTableRow from './PaymentTableRow';
import './PaymentTable.less';

const PaymentTable = ({ intl, sponsor }) => (
  <table className="PaymentTable">
    <thead>
      <tr>
        <th className="PaymentTable basicWidth" rowSpan="2">
          {intl.formatMessage({ id: 'paymentTable_data', defaultMessage: `Date` })}
        </th>
        <th className="PaymentTable maxWidth">
          {intl.formatMessage({ id: 'paymentTable_action', defaultMessage: `Action` })}
        </th>
        <th className="PaymentTable mediumWidth">
          {intl.formatMessage({ id: 'paymentTable_details', defaultMessage: `Details` })}
        </th>
        <th className="PaymentTable basicWidth">
          {intl.formatMessage({ id: 'paymentTable_amount', defaultMessage: `Amount SBD` })}
        </th>
        <th className="PaymentTable basicWidth">
          {intl.formatMessage({ id: 'paymentTable_balance', defaultMessage: `Balance SBD` })}
        </th>
      </tr>
    </thead>
    <tbody>
      <PaymentTableRow sponsor={sponsor} />
    </tbody>
  </table>
);

PaymentTable.propTypes = {
  intl: PropTypes.shape().isRequired,
  sponsor: PropTypes.shape().isRequired,
};

export default injectIntl(PaymentTable);
