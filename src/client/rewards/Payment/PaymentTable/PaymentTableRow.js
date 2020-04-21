import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import { convertDigits, formatDate } from '../../rewardsHelper';
import './PaymentTable.less';
// import { getFieldWithMaxWeight } from '../../../object/wObjectHelper';

const PaymentTableRow = ({ intl, sponsor }) => (
  // const prymaryObjectName = getFieldWithMaxWeight(sponsor.details.main_object, 'name');
  // const reviewObjectName = getFieldWithMaxWeight(sponsor.details.review_object, 'name');
  <tr>
    <td>{formatDate(intl, sponsor.createdAt)}</td>
    <td>
      <div className="PaymentTable__action-wrap">
        <div className="PaymentTable__action-items">
          <span className="PaymentTable__action-item fw6">
            {sponsor.type === 'transfer'
              ? intl.formatMessage({
                  id: 'paymentTable_transfer',
                  defaultMessage: `Transfer`,
                })
              : intl.formatMessage({
                  id: 'paymentTable_review',
                  defaultMessage: 'Review',
                })}
          </span>{' '}
          {sponsor.type === 'transfer'
            ? intl.formatMessage({
                id: 'paymentTable_from',
                defaultMessage: 'from',
              })
            : intl.formatMessage({
                id: 'paymentTable_review_by',
                defaultMessage: 'by',
              })}{' '}
          <Link to={`/@${sponsor.userName}`}>@{sponsor.userName}</Link> (
          {intl.formatMessage({
            id: 'paymentTable_requested_by',
            defaultMessage: `requested by`,
          })}{' '}
          <Link to={`/@${sponsor.sponsor}`}>@{sponsor.sponsor}</Link>)
        </div>
        {sponsor && sponsor.details && sponsor.details.main_object && (
          <div className="PaymentTable__action-items">
            <div>
              <Link to={`/@${sponsor.userName}/${sponsor.details.review_permlink}`}>
                {intl.formatMessage({
                  id: 'paymentTable_review',
                  defaultMessage: `Review`,
                })}
              </Link>
              :{' '}
              <Link to={`/object/${sponsor.details.main_object}`}>
                {sponsor.details.main_object}
                {/* {prymaryObjectName} */}
              </Link>
              ,{' '}
              <Link to={`/object/${sponsor.details.review_object}`}>
                {sponsor.details.review_object}
                {/* {reviewObjectName} */}
              </Link>
            </div>
            <div>
              {intl.formatMessage({
                id: 'beneficiaries-weights',
                defaultMessage: `Beneficiaries`,
              })}
              : {/* {Object.keys(sponsor.details.beneficiaries).map((benef, index) => ( */}
              {/*  <Link to={`/@${benef[index]}`}> */}
              {/*    {benef[index]} */}
              {/*  </Link> */}
              {/* ))} */}
            </div>
          </div>
        )}
      </div>
    </td>
    <td>
      {sponsor.type === 'transfer' || sponsor.type === 'demo_debt' ? (
        <p>
          {intl.formatMessage({
            id: 'paymentTable_debt_repayment',
            defaultMessage: `Debt repayment`,
          })}
        </p>
      ) : (
        <React.Fragment>
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
                id: 'paymentTable_report',
                defaultMessage: `Report`,
              })}
            </Link>
          </p>
        </React.Fragment>
      )}
    </td>
    <td>
      {/* eslint-disable-next-line no-nested-ternary */
      sponsor.amount
        ? sponsor.type === 'transfer'
          ? `-${convertDigits(sponsor.amount)}`
          : convertDigits(sponsor.amount)
        : 0}
    </td>
    <td className="PaymentTable__balance-column">
      {convertDigits(sponsor.balance) ? convertDigits(sponsor.balance) : 0}
    </td>
  </tr>
);
PaymentTableRow.propTypes = {
  intl: PropTypes.shape().isRequired,
  sponsor: PropTypes.shape().isRequired,
};

export default injectIntl(PaymentTableRow);
