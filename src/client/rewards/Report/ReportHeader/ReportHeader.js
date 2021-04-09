import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { get, map } from 'lodash';
import Avatar from '../../../components/Avatar';
import { getSingleReportData } from '../../../store/rewardsStore/rewardsSelectors';

import './ReportHeader.less';

const ReportHeader = ({ intl }) => {
  const singleReportData = useSelector(getSingleReportData);
  const createCampaignDate = moment(singleReportData.createCampaignDate).format('MMMM D, YYYY');
  const reservationDate = moment(singleReportData.reservationDate).format('MMMM D, YYYY');
  const reviewDate = moment(singleReportData.reviewDate).format('MMMM D, YYYY');
  const title = singleReportData.title;
  const rewardHive = singleReportData.rewardHive ? singleReportData.rewardHive.toFixed(3) : 0;
  const rewardUsd = singleReportData.rewardUsd ? singleReportData.rewardUsd.toFixed(2) : 'N/A';
  const userAlias = singleReportData.user.alias;
  const userName = singleReportData.user.name;
  const sponsorAlias = singleReportData.sponsor.alias;
  const sponsorName = singleReportData.sponsor.name;
  const reservationPermlink = get(singleReportData, [
    'histories',
    '0',
    'details',
    'reservation_permlink',
  ]);
  const reviewPermlink = get(singleReportData, ['histories', '0', 'details', 'review_permlink']);
  const activationPermlink = get(singleReportData, ['activationPermlink']);
  const primaryObjectPermlink = get(singleReportData, ['primaryObject', 'author_permlink']);
  const primaryObjectName = get(singleReportData, ['primaryObject', 'object_name']);
  const secondaryObjects = map(singleReportData.secondaryObjects, secondaryObject => ({
    name: secondaryObject.object_name,
    permlink: secondaryObject.author_permlink,
  }));

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
        <div>
          <span className="ReportHeader__campaignInfo-name">
            {intl.formatMessage({
              id: 'campaign_announcement',
              defaultMessage: 'Campaign announcement:',
            })}{' '}
          </span>
          <a href={`/@${sponsorName}/${activationPermlink}`}>
            <span className="ReportHeader__campaignInfo-date">
              {intl.formatMessage({ id: 'posted_on', defaultMessage: 'posted on' })}{' '}
              {createCampaignDate}
            </span>
          </a>
        </div>
        <div>
          <span className="ReportHeader__campaignInfo-name">
            {intl.formatMessage({
              id: 'rewards_reservation',
              defaultMessage: 'Rewards reservation:',
            })}{' '}
          </span>
          <a href={`/@${userName}/${reservationPermlink}`}>
            <span className="ReportHeader__campaignInfo-date">
              {intl.formatMessage({ id: 'posted_on', defaultMessage: 'posted on' })}{' '}
              {reservationDate}
            </span>
          </a>
        </div>
        <div>
          <span className="ReportHeader__campaignInfo-name">
            {intl.formatMessage({ id: 'paymentTable_review', defaultMessage: 'Review' })}:{' '}
          </span>
          <a href={`/@${userName}/${reviewPermlink}`}>
            <span className="ReportHeader__campaignInfo-date">
              {intl.formatMessage({ id: 'posted_on', defaultMessage: 'posted on' })} {reviewDate}
            </span>
          </a>
        </div>
        <div>
          <span className="ReportHeader__campaignInfo-name">
            {intl.formatMessage({ id: 'review_title', defaultMessage: 'Review title:' })}{' '}
          </span>
          <span className="ReportHeader__campaignInfo-title">{title}</span>
        </div>
        <div>
          <span className="ReportHeader__campaignInfo-name">
            {intl.formatMessage({ id: 'links', defaultMessage: 'Links' })}:{' '}
          </span>
          <a href={`/object/${primaryObjectPermlink}`}>
            <span className="ReportHeader__campaignInfo-links">{`${primaryObjectName}, `}</span>
          </a>
          {map(secondaryObjects, object => (
            <a key={object.permlink} href={`/object/${object.permlink}`}>
              <span className="ReportHeader__campaignInfo-links">{object.name}</span>
            </a>
          ))}
        </div>
      </div>
    </React.Fragment>
  );
};

ReportHeader.propTypes = {
  intl: PropTypes.shape().isRequired,
};

export default injectIntl(ReportHeader);
