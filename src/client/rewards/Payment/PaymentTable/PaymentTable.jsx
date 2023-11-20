import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { isEmpty, map, noop } from 'lodash';
import PaymentTableRow from './PaymentTableRow';
import './PaymentTable.less';

const PaymentTable = ({
  intl,
  sponsors,
  isReports,
  currency,
  reservationPermlink,
  hasMore,
  handleShowMore,
}) => (
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
      {isEmpty(sponsors) ? (
        <tr>
          <td colSpan={5}>No records</td>
        </tr>
      ) : (
        map(sponsors, sponsor => (
          <PaymentTableRow
            {...{
              key: sponsor._id,
              sponsor,
              isReports,
              reservationPermlink,
              currency,
            }}
          />
        ))
      )}
      {hasMore && (
        <tr className="PaymentTable__showMore">
          <td colSpan={5} onClick={handleShowMore}>
            Show more
          </td>
        </tr>
      )}
    </tbody>
  </table>
);

PaymentTable.propTypes = {
  intl: PropTypes.shape().isRequired,
  sponsors: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  isReports: PropTypes.bool,
  reservationPermlink: PropTypes.string,
  currency: PropTypes.string,
  hasMore: PropTypes.shape({}),
  handleShowMore: PropTypes.shape({}),
};

PaymentTable.defaultProps = {
  isReports: false,
  reservationPermlink: '',
  currency: 'HIVE',
  hasMore: false,
  handleShowMore: noop,
};

export default injectIntl(PaymentTable);
