import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import { map } from 'lodash';
import { convertDigits, formatDate } from '../../rewardsHelper';
import Report from '../../Report/Report';
// import { getLenders } from '../../../../waivioApi/ApiClient';
// import { getFieldWithMaxWeight } from '../../../object/wObjectHelper';
import './PaymentTable.less';

const PaymentTableRow = ({ intl, sponsor }) => {
  const [isModalReportOpen, setModalReportOpen] = useState(false);
  const toggleModalReport = () => {
    // const requestParams = {
    //   sponsor,
    //   user: sponsor.userName,
    //   reviewPermlink: sponsor.details.review_permlink,
    // }
    setModalReportOpen(!isModalReportOpen);
    // getLenders({requestParams});
  };
  // const prymaryObjectName = getFieldWithMaxWeight(sponsor.details.main_object, 'name');
  // const reviewObjectName = getFieldWithMaxWeight(sponsor.details.review_object, 'name');
  return (
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
            <Link to={`/@${sponsor.userName}`}>@{sponsor.userName}</Link>
            {sponsor.type === 'transfer' ? (
              <React.Fragment>
                {' '}
                {intl.formatMessage({
                  id: 'paymentTable_review_to',
                  defaultMessage: 'to',
                })}
                <Link to={`/@${sponsor.sponsor}`}>@{sponsor.sponsor}</Link>
              </React.Fragment>
            ) : (
              <React.Fragment>
                (
                {intl.formatMessage({
                  id: 'paymentTable_requested_by',
                  defaultMessage: `requested by`,
                })}
                <Link to={`/@${sponsor.sponsor}`}>@{sponsor.sponsor}</Link>)
              </React.Fragment>
            )}
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
                :{' '}
                {map(sponsor.details.beneficiaries, benef => (
                  <React.Fragment>
                    <Link to={`/@${benef.account}`}>{benef.account}</Link>
                    <span>{` (${benef.weight / 100}%) `}</span>
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}
        </div>
      </td>
      <td>
        {sponsor.type === 'transfer' || sponsor.type === 'demo_debt' ? (
          <p>
            {intl.formatMessage({
              id: 'paymentTable_payment',
              defaultMessage: 'Payment',
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
            <div className="PaymentTable__report" onClick={toggleModalReport} role="presentation">
              <span>
                {intl.formatMessage({
                  id: 'paymentTable_report',
                  defaultMessage: `Report`,
                })}
              </span>
            </div>
          </React.Fragment>
        )}
        <Report isModalReportOpen={isModalReportOpen} toggleModal={toggleModalReport} />
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
};

PaymentTableRow.propTypes = {
  intl: PropTypes.shape().isRequired,
  sponsor: PropTypes.shape().isRequired,
};

export default injectIntl(PaymentTableRow);
