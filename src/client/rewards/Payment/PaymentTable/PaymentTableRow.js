import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import { formatDate } from '../../rewardsHelper';
import './PaymentTable.less';

const PaymentTableRow = ({ intl, sponsor }) => (
  <tr>
    <td>{formatDate(intl, sponsor.createdAt)}</td>
    <td>
      <div className="PaymentTable__action-wrap">
        <div>
          <React.Fragment>
            <span className="PaymentTable__action-item fw6">
              {intl.formatMessage({
                id: 'paymentTable_review',
                defaultMessage: `Review`,
              })}
            </span>{' '}
            {intl.formatMessage({
              id: 'paymentTable_review_by',
              defaultMessage: `by`,
            })}{' '}
            <Link to={`/@${sponsor.userName}`}>@{sponsor.userName}</Link> (
            {intl.formatMessage({
              id: 'paymentTable_requested_by',
              defaultMessage: `requested by`,
            })}{' '}
            <Link to={`/@${sponsor.userName}`}>@{sponsor.sponsor}</Link>)
          </React.Fragment>
          {sponsor && sponsor.details && sponsor.details.main_object && (
            <div className="PaymentTable__action-column ml3">
              <div>
                {`- `}
                <Link to={`/object/${sponsor.details.main_object}`}>
                  {sponsor.details.main_object}
                </Link>
              </div>
              <div>
                {`- `}
                <Link to={`/object/${sponsor.details.review_object}`}>
                  {sponsor.details.review_object}
                </Link>
              </div>
            </div>
          )}
        </div>
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
    <td>{sponsor.amount_sbd ? sponsor.amount_sbd : 0}</td>
    <td className="PaymentTable__balance-column">{sponsor.balance ? sponsor.balance : 0}</td>
  </tr>
);

PaymentTableRow.propTypes = {
  intl: PropTypes.shape().isRequired,
  sponsor: PropTypes.shape().isRequired,
};

export default injectIntl(PaymentTableRow);
