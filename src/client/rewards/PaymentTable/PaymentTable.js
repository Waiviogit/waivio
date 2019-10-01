import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
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
      <tr>
        <td>{sponsor}</td>
        <td>2</td>
        <td>3</td>
        <td>4</td>
        <td>5</td>
      </tr>
    </tbody>
  </table>
);

PaymentTable.propTypes = {
  intl: PropTypes.shape().isRequired,
  sponsor: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

export default injectIntl(PaymentTable);
