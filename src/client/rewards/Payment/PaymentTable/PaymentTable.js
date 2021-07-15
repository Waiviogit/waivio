import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { map } from 'lodash';
import PaymentTableRow from './PaymentTableRow';
import './PaymentTable.less';

const PaymentTable = ({ intl, sponsors, isReports, currency, reservationPermlink }) => (
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
          {intl.formatMessage(
            {
              id: 'paymentTable_amount',
              defaultMessage: 'Amount {currency}',
            },
            { currency },
          )}
        </th>
        <th className="PaymentTable basicWidth">
          {intl.formatMessage(
            {
              id: 'paymentTable_balance',
              defaultMessage: 'Balance {currency}',
            },
            { currency },
          )}
        </th>
      </tr>
    </thead>
    <tbody>
      {map(sponsors, sponsor => (
        <PaymentTableRow
          {...{
            key: sponsor._id,
            sponsor,
            isReports,
            reservationPermlink,
          }}
        />
      ))}
    </tbody>
  </table>
);

PaymentTable.propTypes = {
  intl: PropTypes.shape().isRequired,
  sponsors: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  isReports: PropTypes.bool,
  isHive: PropTypes.bool,
  reservationPermlink: PropTypes.string,
  currency: PropTypes.string,
};

PaymentTable.defaultProps = {
  isReports: false,
  isHive: false,
  reservationPermlink: '',
  currency: 'HIVE',
};

export default injectIntl(PaymentTable);
