import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import _ from 'lodash';
import PaymentTableRow from './PaymentTableRow';
import './PaymentTable.less';

const PaymentTable = ({ intl, sponsors, isReports }) => (
  <table className="PaymentTable">
    <thead>
      <tr>
        <th className="PaymentTable basicWidth" rowSpan="2">
          {intl.formatMessage({
            id: `${isReports ? 'paymentTable_data_time' : 'paymentTable_data'}`,
            defaultMessage: `${isReports ? 'Date & Time (GMT)' : 'Date'}`,
          })}
        </th>
        <th className="PaymentTable maxWidth">
          {intl.formatMessage({ id: 'paymentTable_action', defaultMessage: `Action` })}
        </th>
        <th className="PaymentTable mediumWidth">
          {intl.formatMessage({ id: 'paymentTable_details', defaultMessage: `Details` })}
        </th>
        <th className="PaymentTable basicWidth">
          {intl.formatMessage({
            id: `${isReports ? 'paymentTable_amount_USD' : 'paymentTable_amount'}`,
            defaultMessage: `${isReports ? 'Amount USD' : 'Amount HIVE'}`,
          })}
        </th>
        <th className="PaymentTable basicWidth">
          {intl.formatMessage({
            id: `${isReports ? 'paymentTable_balance_USD' : 'paymentTable_balance'}`,
            defaultMessage: `${isReports ? 'Balance USD' : 'Balance HIVE'}`,
          })}
        </th>
      </tr>
    </thead>
    <tbody>
      {_.map(sponsors, sponsor => (
        // eslint-disable-next-line no-underscore-dangle
        <PaymentTableRow key={sponsor._id} sponsor={sponsor} />
      ))}
    </tbody>
  </table>
);

PaymentTable.propTypes = {
  intl: PropTypes.shape().isRequired,
  sponsors: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  isReports: PropTypes.bool,
};

PaymentTable.defaultProps = {
  isReports: false,
};

export default injectIntl(PaymentTable);
