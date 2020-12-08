import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { map, reduce, get } from 'lodash';
import moment from 'moment';
import { convertDigits, formatDate } from '../../rewardsHelper';
import Report from '../../Report/Report';
import { getReport } from '../../../../waivioApi/ApiClient';
import { setDataForSingleReport } from '../../rewardsActions';
import { TYPE } from '../../../../common/constants/rewards';
import { getObjectName } from '../../../helpers/wObjectHelper';

import './PaymentTable.less';

const PaymentTableRow = ({ intl, sponsor, isReports, isHive, reservationPermlink }) => {
  const [isModalReportOpen, setModalReportOpen] = useState(false);
  const getConvertDigits = obj =>
    obj.type === 'transfer'
      ? `-${convertDigits(obj.amount, isHive)}`
      : convertDigits(obj.amount, isHive);
  const dispatch = useDispatch();
  const toggleModalReport = () => {
    const requestParams = {
      guideName: sponsor.sponsor,
      userName: sponsor.userName,
      reservationPermlink: sponsor.details.reservation_permlink,
    };
    getReport(requestParams)
      .then(data => {
        dispatch(setDataForSingleReport(data));
      })
      .then(() => setModalReportOpen(!isModalReportOpen))
      .catch(e => console.log(e));
  };
  useEffect(() => {
    if (reservationPermlink === sponsor.details.reservation_permlink) {
      toggleModalReport();
    }
  }, []);
  const closeModalReport = () => {
    if (isModalReportOpen) setModalReportOpen(!isModalReportOpen);
  };

  const prymaryObjectName = getObjectName(get(sponsor, 'details.main_object', {}));
  const reviewObjectName = getObjectName(get(sponsor, 'details.review_object', {}));
  const beneficiaries = get(sponsor, ['details', 'beneficiaries']);
  const userWeight = `(${(10000 -
    reduce(beneficiaries, (amount, benef) => amount + benef.weight, 0)) /
    100}%)`;
  const time = isReports ? moment(sponsor.createdAt).format('h:mm:ss') : '';
  const getOperation = useCallback(() => {
    switch (sponsor.type) {
      case TYPE.overpaymentRefund:
        return (
          <React.Fragment>
            <span className="PaymentTable__action-item fw6">
              {intl.formatMessage({
                id: 'paymentTable_transfer',
                defaultMessage: `Transfer`,
              })}{' '}
            </span>
            {intl.formatMessage({
              id: 'paymentTable_from',
              defaultMessage: 'from',
            })}{' '}
            <Link to={`/@${sponsor.sponsor}`}>@{sponsor.userName}</Link>{' '}
            {intl.formatMessage({
              id: 'paymentTable_review_to',
              defaultMessage: 'to',
            })}{' '}
            <Link to={`/@${sponsor.userName}`}>@{sponsor.sponsor}</Link>
          </React.Fragment>
        );
      case TYPE.transfer:
      case TYPE.demoDebt:
        return (
          <React.Fragment>
            {sponsor.sponsor === sponsor.userName ? (
              <div>
                <span className="PaymentTable__action-item fw6">
                  {intl.formatMessage({
                    id: 'send_to',
                    defaultMessage: `Send to`,
                  })}{' '}
                </span>
                <Link to={`/@${sponsor.sponsor}`}>@{sponsor.sponsor}</Link>{' '}
                {intl.formatMessage({
                  id: 'received_from_self',
                  defaultMessage: 'received from self',
                })}
              </div>
            ) : (
              <div>
                <span className="PaymentTable__action-item fw6">
                  {intl.formatMessage({
                    id: 'paymentTable_transfer',
                    defaultMessage: `Transfer`,
                  })}{' '}
                </span>
                {intl.formatMessage({
                  id: 'paymentTable_from',
                  defaultMessage: 'from',
                })}{' '}
                <Link to={`/@${sponsor.sponsor}`}>@{sponsor.sponsor}</Link>{' '}
                {intl.formatMessage({
                  id: 'paymentTable_review_to',
                  defaultMessage: 'to',
                })}{' '}
                <Link to={`/@${sponsor.userName}`}>@{sponsor.userName}</Link>
              </div>
            )}
          </React.Fragment>
        );
      default:
        return (
          <React.Fragment>
            <span className="PaymentTable__action-item fw6">
              {intl.formatMessage({
                id: 'paymentTable_review',
                defaultMessage: 'Review',
              })}
            </span>{' '}
            {intl.formatMessage({
              id: 'paymentTable_review_by',
              defaultMessage: 'by',
            })}{' '}
            <Link to={`/@${sponsor.userName}`}>@{sponsor.userName}</Link> (
            {intl.formatMessage({
              id: 'paymentTable_requested_by',
              defaultMessage: `requested by`,
            })}{' '}
            <Link to={`/@${sponsor.sponsor}`}>@{sponsor.sponsor}</Link>)
          </React.Fragment>
        );
    }
  }, [sponsor]);

  const reviewPermlink = get(sponsor, ['details', 'review_permlink'], '');
  const review = intl.formatMessage({
    id: 'paymentTable_review',
    defaultMessage: `Review`,
  });

  return (
    <tr>
      <td>
        {formatDate(intl, sponsor.createdAt)} {time}
      </td>
      <td>
        <div className="PaymentTable__action-wrap">
          <div className="PaymentTable__action-items">{getOperation()}</div>
          {sponsor && sponsor.details && sponsor.details.main_object && (
            <div className="PaymentTable__action-items">
              <div>
                {reviewPermlink ? (
                  <Link to={`/@${sponsor.userName}/${sponsor.details.review_permlink}`}>
                    {review}
                  </Link>
                ) : (
                  review
                )}
                :{' '}
                <Link to={`/object/${get(sponsor, ['details', 'main_object', 'author_permlink'])}`}>
                  {prymaryObjectName}
                </Link>
                ,{' '}
                <Link
                  to={`/object/${get(sponsor, ['details', 'review_object', 'author_permlink'])}`}
                >
                  {reviewObjectName}
                </Link>
              </div>
              <div>
                {intl.formatMessage({
                  id: 'beneficiaries-weights',
                  defaultMessage: `Beneficiaries`,
                })}
                :{' '}
                {beneficiaries
                  ? map(beneficiaries, benef => (
                      <React.Fragment key={benef.account}>
                        <Link to={`/@${benef.account}`}>{benef.account}</Link>
                        <span>{` (${benef.weight / 100}%), `}</span>
                      </React.Fragment>
                    ))
                  : null}{' '}
                <Link to={`/@${sponsor.userName}`}>{sponsor.userName}</Link> {userWeight}
              </div>
            </div>
          )}
        </div>
      </td>
      <td>
        {sponsor.type === TYPE.transfer ||
        sponsor.type === TYPE.demoDebt ||
        sponsor.type === TYPE.overpaymentRefund ? (
          <p>
            {intl.formatMessage({
              id: 'paymentTable_payment',
              defaultMessage: 'Payment',
            })}
          </p>
        ) : (
          <React.Fragment>
            <p>
              <Link
                to={`/@${sponsor.userName}/${get(sponsor, ['details', 'reservation_permlink'])}`}
              >
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
        <Report
          isModalReportOpen={isModalReportOpen}
          toggleModal={closeModalReport}
          sponsor={sponsor}
        />
      </td>
      <td>{sponsor.amount ? getConvertDigits(sponsor) : 0}</td>
      <td className="PaymentTable__balance-column">
        {convertDigits(sponsor.balance, isHive) ? convertDigits(sponsor.balance, isHive) : 0}
      </td>
    </tr>
  );
};

PaymentTableRow.propTypes = {
  intl: PropTypes.shape().isRequired,
  sponsor: PropTypes.shape().isRequired,
  isReports: PropTypes.bool,
  isHive: PropTypes.bool,
  reservationPermlink: PropTypes.string,
};

PaymentTableRow.defaultProps = {
  isReports: false,
  isHive: false,
  reservationPermlink: '',
};

export default injectIntl(PaymentTableRow);
