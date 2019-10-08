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
          </span>{' '}
          {intl.formatMessage(
            {
              id: 'paymentTable_review_by_user',
              defaultMessage: `by @${sponsor.userName} (requested by @${sponsor.sponsor})`,
            },
            {
              userName: sponsor.userName,
              sponsorName: sponsor.sponsor,
            },
          )}
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
        <Link to={`/rewards/reserved`}>
          {intl.formatMessage({
            id: 'paymentTable_reservation',
            defaultMessage: `Reservation`,
          })}{' '}
          (mock)
        </Link>
      </p>
      <p>
        <Link to={`/rewards/review`}>
          {intl.formatMessage({
            id: 'paymentTable_review',
            defaultMessage: `Review`,
          })}{' '}
          (mock)
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
