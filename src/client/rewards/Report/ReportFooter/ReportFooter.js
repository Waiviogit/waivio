import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Button } from 'antd';
import { useSelector } from 'react-redux';
import { get, isEmpty, map } from 'lodash';
import { getSingleReportData } from '../../../store/reducers';

const ReportFooter = ({ intl, toggleModal }) => {
  const singleReportData = useSelector(getSingleReportData);
  const reservationRate = get(singleReportData, ['histories', '0', 'details', 'hiveCurrency']);
  const sponsor = get(singleReportData, ['sponsor', 'name']);

  return (
    <div className="Report__modal-footer">
      <div className="Report__modal-footer-notes">
        <div>
          *{' '}
          {intl.formatMessage(
            {
              id: 'exchange_rate',
              defaultMessage:
                'The exchange rate is recorded at the time of reservation of the reward (1 HIVE = {reservationRate} USD).',
            },
            {
              reservationRate: reservationRate || 'N/A',
            },
          )}
        </div>
        <div>
          **{' '}
          {intl.formatMessage({
            id: 'only_upvotes_from_registered_accounts',
            defaultMessage: 'Only upvotes from registered accounts',
          })}{' '}
          (<a href={`/@${sponsor}`}>{sponsor}</a>
          {!isEmpty(singleReportData.match_bots)
            ? map(singleReportData.match_bots, bot => (
                <a key={bot} href={`/@${bot}`}>
                  , {bot}
                </a>
              ))
            : ''}
          ){' '}
          {intl.formatMessage({
            id: 'count_towards_the_payment_of_rewards',
            defaultMessage:
              'count towards the payment of rewards. The value of all other upvotes is not subtracted from the specified amount of the reward.',
          })}
        </div>
        <div>
          ***{' '}
          {intl.formatMessage({
            id: 'processing_fees_are_paid_by_campaign_sponsor',
            defaultMessage:
              'Processing fees are paid by campaign sponsor in addition to the user rewards.',
          })}
        </div>
      </div>
      <div className="Report__modal-footer-btn">
        <Button type="primary" onClick={toggleModal}>
          {intl.formatMessage({
            id: 'modal_button_yes',
            defaultMessage: `Ok`,
          })}
        </Button>
      </div>
    </div>
  );
};

ReportFooter.propTypes = {
  intl: PropTypes.shape().isRequired,
  toggleModal: PropTypes.func.isRequired,
};

export default injectIntl(ReportFooter);
