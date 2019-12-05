import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import { formatDate } from '../../rewardsHelper';
import './PaymentTable.less';

const PaymentTableRow = ({ intl, sponsor }) => (
  <tr>
    <td>{formatDate(sponsor.createdAt)}</td>
    <td>
      <div className="PaymentTable__action-column">
        <div>
          <span className="PaymentTable__action-column fw6">
            {intl.formatMessage({
              id: 'paymentTable_review',
              defaultMessage: `Review`,
            })}
          </span>
          &nbsp;
          {intl.formatMessage({
            id: 'paymentTable_review_by',
            defaultMessage: `by`,
          })}
          <Link to={`/@${sponsor.userName}`}>@{sponsor.userName}</Link> (
          {intl.formatMessage({
            id: 'paymentTable_requested_by',
            defaultMessage: `requested by`,
          })}{' '}
          <Link to={`/@${sponsor.userName}`}>@{sponsor.sponsor}</Link>)
        </div>
        {sponsor && sponsor.details ? (
          <div className="PaymentTable__action-column ml3">
            <div>
              {`-`}
              {sponsor.details.main_object}
            </div>
            <div>
              {`-`}
              {sponsor.details.review_object}
            </div>
          </div>
        ) : null}
      </div>
    </td>
    <td>
      <p>
        <Link to={`/@${sponsor.userName}/${sponsor.details.reservation_permlink}`}>
          {intl.formatMessage({
            id: 'paymentTable_reservation',
            defaultMessage: `Reservation`,
          })}
        </Link>
      </p>
      <p>
        <Link to={`/@${sponsor.userName}/${sponsor.details.review_permlink}`}>
          {intl.formatMessage({
            id: 'paymentTable_review',
            defaultMessage: `Review`,
          })}
        </Link>
      </p>
    </td>
    <td>{sponsor.amount_sbd}</td>
    <td className="PaymentTable__balance-column">{sponsor.balance}</td>
  </tr>
);

PaymentTableRow.propTypes = {
  intl: PropTypes.shape().isRequired,
  sponsor: PropTypes.shape().isRequired,
};

export default injectIntl(PaymentTableRow);
