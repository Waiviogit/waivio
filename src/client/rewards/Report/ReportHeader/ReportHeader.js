import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { getSingleReportData } from '../../../reducers';
import Avatar from '../../../components/Avatar';
import './ReportHeader.less';

const ReportHeader = ({ intl }) => {
  const singleReportData = useSelector(getSingleReportData);
  const createCampaignDate = moment(singleReportData.createCampaignDate).format('MMMM Do YYYY');
  const reservationDate = moment(singleReportData.reservationDate).format('MMMM Do YYYY');
  const reviewDate = moment(singleReportData.reviewDate).format('MMMM Do YYYY');
  const title = singleReportData.title;
  const rewardHive = singleReportData.rewardHive;
  const rewardUsd = singleReportData.rewardUsd;
  const userAlias = singleReportData.user.alias;
  const userName = singleReportData.user.name;
  const sponsorAlias = singleReportData.sponsor.alias;
  const sponsorName = singleReportData.sponsor.name;

  return (
    <React.Fragment>
      <div className="ReportHeader">
        <div className="ReportHeader__name">
          {intl.formatMessage({
            id: 'distribution_of_the_rewards',
            defaultMessage: 'Distribution of the rewards',
          })}
        </div>
        <div className="ReportHeader__data">
          <React.Fragment>
            <span className="ReportHeader__data-colored">
              <span className="hive">{` ${rewardHive} HIVE `}</span>
              <span className="usd">{` (${rewardUsd} USD*) `}</span>
            </span>
          </React.Fragment>
        </div>
      </div>
      <div className="ReportHeader__user-info">
        <div className="ReportHeader__user-info__content">
          <div className="ReportHeader__user-info__sponsor">
            <div className="ReportHeader__user-info__sponsor-header">
              <span>{intl.formatMessage({ id: 'sponsor', defaultMessage: 'Sponsor' })}</span>
            </div>
            <div className="ReportHeader__user-info__sponsor-content">
              <Avatar username={sponsorName} size={44} />
              <div className="ReportHeader__user-info__sponsor-name-wrap">
                <div className="ReportHeader__user-info__sponsor-name-wrap-alias">
                  {sponsorAlias}
                </div>
                <div className="ReportHeader__user-info__sponsor-name-wrap-row">
                  <div className="ReportHeader__user-info__sponsor-name-wrap-row-name">
                    {`@${sponsorName}`}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="ReportHeader__user-info__user">
            <div className="ReportHeader__user-info__user-header">
              <span className="user">
                {intl.formatMessage({ id: 'user', defaultMessage: 'User' })}
              </span>
            </div>
            <div className="ReportHeader__user-info__user-content">
              <Avatar username={userName} size={44} />
              <div className="ReportHeader__user-info__user-name-wrap">
                <div className="ReportHeader__user-info__user-name-wrap-alias">{userAlias}</div>
                <div className="ReportHeader__user-info__user-name-wrap-row">
                  <div className="ReportHeader__user-info__user-name-wrap-row-name">
                    {`@${userName}`}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="ReportHeader__campaignInfo" role="presentation">
        <span>
          {intl.formatMessage({
            id: 'campaign_announcement',
            defaultMessage: 'Campaign announcement:',
          })}{' '}
          <span className="ReportHeader__campaignInfo-date">
            {intl.formatMessage({ id: 'posted_on', defaultMessage: 'posted on' })}{' '}
            {createCampaignDate}
          </span>
        </span>
        <span>
          {intl.formatMessage({
            id: 'rewards_reservation',
            defaultMessage: 'Rewards reservation:',
          })}{' '}
          <span className="ReportHeader__campaignInfo-date">
            {intl.formatMessage({ id: 'posted_on', defaultMessage: 'posted on' })} {reservationDate}
          </span>
        </span>
        <span>
          {intl.formatMessage({ id: 'paymentTable_review', defaultMessage: 'Review' })}:{' '}
          <span className="ReportHeader__campaignInfo-date">
            {intl.formatMessage({ id: 'posted_on', defaultMessage: 'posted on' })} {reviewDate}
          </span>
        </span>
        <span>
          {intl.formatMessage({ id: 'review_title', defaultMessage: 'Review title:' })}{' '}
          <span className="ReportHeader__campaignInfo-title">{title}</span>
        </span>
      </div>
    </React.Fragment>
  );
};

ReportHeader.propTypes = {
  intl: PropTypes.shape().isRequired,
};

export default injectIntl(ReportHeader);
