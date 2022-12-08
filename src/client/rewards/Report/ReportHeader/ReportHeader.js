import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { get, isEmpty, map, round } from 'lodash';

import Avatar from '../../../components/Avatar';
import { getSingleReportData } from '../../../../store/rewardsStore/rewardsSelectors';
import { getObjectName, getObjectUrlForLink } from '../../../../common/helpers/wObjectHelper';

import './ReportHeader.less';

const ReportHeader = ({ intl, currencyInfo, reportDetails, payoutToken }) => {
  const singleReportData = reportDetails || useSelector(getSingleReportData);
  const createCampaignDate = moment(singleReportData.createCampaignDate).format('MMMM D, YYYY');
  const reservationDate = moment(singleReportData.reservationDate).format('MMMM D, YYYY');
  const reviewDate = moment(singleReportData.reviewDate).format('MMMM D, YYYY');
  const title = singleReportData.title;
  const reward = singleReportData.rewardTokenAmount || singleReportData.rewardHive;
  const rewardHive = reward ? round(reward, 3) : 0;

  const rewardUsd = singleReportData.rewardUsd
    ? round(singleReportData.rewardUsd * currencyInfo.rate, 2)
    : 'N/A';

  const userAlias = singleReportData.user.alias;
  const userName = singleReportData.user.name;
  const sponsorAlias = singleReportData.sponsor.alias;
  const sponsorName = singleReportData.sponsor.name;
  const reservationPermlink =
    get(singleReportData, ['histories', '0', 'details', 'reservation_permlink']) ||
    singleReportData?.reservationPermlink;

  const reviewPermlink =
    get(singleReportData, ['histories', '0', 'details', 'review_permlink']) ||
    get(singleReportData, ['histories', '0', 'reviewPermlink']);
  const activationPermlink = get(singleReportData, ['activationPermlink']);
  const primaryObject = singleReportData?.primaryObject || singleReportData?.requiredObject;
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
              <span className="hive">{` ${rewardHive} ${payoutToken} `}</span>
              <span className="usd">
                ({rewardUsd} {currencyInfo.type}*)
              </span>
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
          <a href={getObjectUrlForLink(primaryObject)}>
            <span className="ReportHeader__campaignInfo-links">{`${getObjectName(
              primaryObject,
            )}, `}</span>
          </a>
          {!isEmpty(secondaryObjects) ? (
            map(secondaryObjects, object => (
              <a key={object.permlink} href={getObjectUrlForLink(object)}>
                <span className="ReportHeader__campaignInfo-links">{object.name}</span>
              </a>
            ))
          ) : (
            <a href={getObjectUrlForLink(singleReportData?.secondaryObject)}>
              <span className="ReportHeader__campaignInfo-links">
                {getObjectName(singleReportData?.secondaryObject)}
              </span>
            </a>
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

ReportHeader.propTypes = {
  intl: PropTypes.shape().isRequired,
  currencyInfo: PropTypes.shape({
    type: PropTypes.string,
    rate: PropTypes.number,
  }).isRequired,
  reportDetails: PropTypes.shape().isRequired,
  payoutToken: PropTypes.string.isRequired,
};

export default injectIntl(ReportHeader);
