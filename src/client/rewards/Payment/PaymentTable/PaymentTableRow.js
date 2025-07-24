import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import { map, reduce, get, isEmpty } from 'lodash';
import moment from 'moment';

import { convertDigits, formatDate } from '../../rewardsHelper';
import Report from '../../Report/Report';
import { TYPE } from '../../../../common/constants/rewards';
import { getObjectName } from '../../../../common/helpers/wObjectHelper';

import './PaymentTable.less';

const PaymentTableRow = ({ intl, sponsor, isReports, reservationPermlink }) => {
  const [isModalReportOpen, setModalReportOpen] = useState(false);
  const getConvertDigits = obj =>
    [TYPE.transfer, TYPE.transferToGuest].includes(obj.type)
      ? `-${convertDigits(obj.amount)}`
      : convertDigits(obj.amount);
  const guideName = sponsor.sponsor || sponsor.guideName;
  const toggleModalReport = () => {
    setModalReportOpen(!isModalReportOpen);
  };

  useEffect(() => {
    if (
      reservationPermlink === (sponsor?.details?.reservation_permlink || sponsor?.reviewPermlink)
    ) {
      toggleModalReport();
    }
  }, []);
  const closeModalReport = () => {
    if (isModalReportOpen) setModalReportOpen(!isModalReportOpen);
  };

  const primaryObjectName = getObjectName(
    get(sponsor, 'details.main_object', null) || sponsor?.mainObject,
  );
  const reviewObjectName = getObjectName(
    get(sponsor, 'details.review_object', null) || sponsor?.reviewObject,
  );

  const beneficiaries = sponsor?.details
    ? get(sponsor, ['details', 'beneficiaries'])
    : sponsor?.beneficiaries;

  const userWeight = `(${(10000 -
    reduce(beneficiaries, (amount, benef) => amount + benef.weight, 0)) /
    100}%)`;
  const getReviewType = () => {
    switch (sponsor.campaignType) {
      case 'mentions':
        return intl.formatMessage({
          id: 'mention',
          defaultMessage: `Mention`,
        });

      case 'giveaways':
        return intl.formatMessage({
          id: 'giveaway',
          defaultMessage: `Giveaway`,
        });

      default:
        return intl.formatMessage({
          id: 'paymentTable_review',
          defaultMessage: `Review`,
        });
    }
  };

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
            <Link to={`/@${sponsor.userName}`}>@{sponsor.userName}</Link>{' '}
            {intl.formatMessage({
              id: 'paymentTable_review_to',
              defaultMessage: 'to',
            })}{' '}
            <Link to={`/@${guideName}`}>@{guideName}</Link>
          </React.Fragment>
        );
      case TYPE.transfer:
      case TYPE.transferToGuest:
      case TYPE.demoDebt:
        return (
          <React.Fragment>
            {guideName === sponsor.userName ? (
              <div>
                <span className="PaymentTable__action-item fw6">
                  {intl.formatMessage({
                    id: 'send_to',
                    defaultMessage: `Send to`,
                  })}{' '}
                </span>
                <Link to={`/@${guideName}`}>@{guideName}</Link>{' '}
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
                <Link to={`/@${guideName}`}>@{guideName}</Link>{' '}
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
            <span className="PaymentTable__action-item fw6">{getReviewType()}</span>{' '}
            {intl.formatMessage({
              id: 'paymentTable_review_by',
              defaultMessage: 'by',
            })}{' '}
            <Link to={`/@${sponsor.userName}`}>@{sponsor.userName}</Link> (
            {intl.formatMessage({
              id: 'paymentTable_requested_by',
              defaultMessage: `requested by`,
            })}{' '}
            <Link to={`/@${guideName}`}>@{guideName}</Link>)
          </React.Fragment>
        );
    }
  }, [sponsor]);

  const reviewPermlink =
    get(sponsor, ['details', 'review_permlink'], '') || sponsor?.reviewPermlink;

  const review = getReviewType();

  return (
    <tr>
      <td>
        {formatDate(intl, sponsor.createdAt)} {time}
      </td>
      <td>
        <div className="PaymentTable__action-wrap">
          <div className="PaymentTable__action-items">{getOperation()}</div>
          {primaryObjectName && (
            <div className="PaymentTable__action-items">
              <div>
                {reviewPermlink ? (
                  <Link
                    to={
                      sponsor.campaignType
                        ? `/@${reviewPermlink}`
                        : `/@${sponsor.userName}/${reviewPermlink}`
                    }
                  >
                    {review}
                  </Link>
                ) : (
                  review
                )}
                :{' '}
                <Link
                  to={
                    !isEmpty(sponsor?.mainObject)
                      ? sponsor?.mainObject?.defaultShowLink || `/@${sponsor?.mainObject?.name}`
                      : `/object/${get(sponsor, ['details', 'main_object', 'author_permlink'])}`
                  }
                >
                  {primaryObjectName}
                </Link>
                {sponsor?.mainObject?.defaultShowLink !==
                  sponsor?.reviewObject?.defaultShowLink && (
                  <React.Fragment>
                    ,{' '}
                    <Link
                      to={
                        sponsor?.reviewObject
                          ? sponsor?.reviewObject?.defaultShowLink
                          : `/object/${get(sponsor, [
                              'details',
                              'review_object',
                              'author_permlink',
                            ])}`
                      }
                    >
                      {reviewObjectName}
                    </Link>
                  </React.Fragment>
                )}
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
        {[TYPE.transfer, TYPE.transferToGuest, TYPE.demoDebt, TYPE.overpaymentRefund].includes(
          sponsor.type,
        ) ? (
          <p>
            {intl.formatMessage({
              id: 'paymentTable_payment',
              defaultMessage: 'Payment',
            })}
          </p>
        ) : (
          <React.Fragment>
            {sponsor.campaignType === 'reviews' && (
              <p>
                <Link
                  to={`/@${sponsor.userName}/${get(sponsor, ['details', 'reservation_permlink']) ||
                    sponsor?.reservationPermlink}`}
                >
                  {intl.formatMessage({
                    id: 'paymentTable_reservation',
                    defaultMessage: `Reservation`,
                  })}
                </Link>
              </p>
            )}
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
          reservPermlink={reservationPermlink}
        />
      </td>
      <td>{sponsor.amount ? getConvertDigits(sponsor) : 0}</td>
      <td className="PaymentTable__balance-column">{convertDigits(sponsor.balance) || 0}</td>
    </tr>
  );
};

PaymentTableRow.propTypes = {
  intl: PropTypes.shape().isRequired,
  sponsor: PropTypes.shape().isRequired,
  isReports: PropTypes.bool,
  reservationPermlink: PropTypes.string,
};

PaymentTableRow.defaultProps = {
  isReports: false,
  reservationPermlink: '',
};

export default injectIntl(PaymentTableRow);
