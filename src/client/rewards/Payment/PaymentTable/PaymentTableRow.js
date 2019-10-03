import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import { formatDate } from '../../rewardsHelper';
import './PaymentTable.less';

const PaymentTableRow = ({ intl, sponsor }) => (
  <tr>
    <td>{formatDate(sponsor[0].createdAt)}</td>
    <td>
      <div className="PaymentTable__action-column">
        <div>
          <span>
            {intl.formatMessage({
              id: 'paymentTable_review',
              defaultMessage: `Review`,
            })}
          </span>{' '}
          {intl.formatMessage(
            {
              id: 'paymentTable_review_by_user',
              defaultMessage: `by @${sponsor[0].userName} (requested by @${sponsor[0].sponsor})`,
            },
            {
              campaignName: sponsor[0].userName,
            },
          )}
        </div>
        {sponsor && sponsor[0].details ? (
          <React.Fragment>
            <p>
              {`-`}
              {sponsor[0].details.main_object}
            </p>
            <p>
              {`-`}
              {sponsor[0].details.review_object}
            </p>
          </React.Fragment>
        ) : null}
      </div>
    </td>
    <td>
      <p>
        <Link to={`/reservation`}>Reservation</Link>
      </p>
      <p>
        <Link to={`/review`}>Review</Link>
      </p>
    </td>
    <td>{sponsor.amount_sbd}</td>
    <td>{sponsor.balance}</td>
  </tr>
);

PaymentTableRow.propTypes = {
  intl: PropTypes.shape().isRequired,
  sponsor: PropTypes.shape().isRequired,
};

export default injectIntl(PaymentTableRow);
