import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import _ from 'lodash';
import PaymentTableRow from './PaymentTableRow';
import './PaymentTable.less';

const PaymentTable = ({ intl, sponsors }) => (
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
          {intl.formatMessage({ id: 'paymentTable_amount', defaultMessage: `Amount STEEM` })}
        </th>
        <th className="PaymentTable basicWidth">
          {intl.formatMessage({ id: 'paymentTable_balance', defaultMessage: `Balance STEEM` })}
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
};

export default injectIntl(PaymentTable);
