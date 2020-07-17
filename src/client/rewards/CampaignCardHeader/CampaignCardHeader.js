import React from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { get, isEmpty } from 'lodash';
import Avatar from '../../components/Avatar';
import { getCurrentUSDPrice } from '../rewardsHelper';
import './CampaignCardHeader.less';

const CampaignCardHeader = ({ intl, campaignData, match }) => {
  const currentUSDPrice = getCurrentUSDPrice();
  const price = get(campaignData, ['objects', '0', 'reward']);
  const isAssigned = get(campaignData, ['objects', '0', 'assigned']);
  const isMessages = match && match.params.filterKey === 'messages';
  const rewardPriceHive = `${
    !isEmpty(price) ? price.toFixed(3) : (campaignData.reward * currentUSDPrice).toFixed(3)
  } HIVE`;
  const rewardPriceUsd = `${campaignData.reward} USD`;
  const rewardPrice = isAssigned || isMessages ? rewardPriceHive : rewardPriceUsd;
  return (
    <React.Fragment>
      <div className="CampaignCardHeader">
        <div className="CampaignCardHeader__name">
          {intl.formatMessage({
            id: 'rewards_details_reward_for_reviews',
            defaultMessage: 'Reward for reviews',
          })}
        </div>
        <div className="CampaignCardHeader__data">
          <span className="CampaignCardHeader__name-earn">
            {intl.formatMessage({
              id: 'rewards_details_earn',
              defaultMessage: 'Earn',
            })}{' '}
          </span>
          <React.Fragment>
            <span className="CampaignCardHeader__data-colored">
              <span className="fw6">{rewardPrice}</span>
            </span>
          </React.Fragment>
        </div>
      </div>
      <div className="user-info">
        <Link to={`/@${campaignData.guide.name}`}>
          <Avatar username={campaignData.guide.name} size={44} />
        </Link>
        <div className="user-info__content">
          <Link to={`/@${campaignData.guide.name}`} title={campaignData.guide.name}>
            <div className="username">
              {campaignData.guide.alias} (
              {intl.formatMessage({ id: 'sponsor', defaultMessage: 'Sponsor' })})
            </div>
            <div className="username">{`@${campaignData.guide.name}`}</div>
          </Link>
          <div className="total-paid">
            <div>
              {intl.formatMessage({
                id: 'total_paid_liquid',
                defaultMessage: 'Total paid (liquid)',
              })}
            </div>
            <div className="total-paid__colon">:</div>
            <div>
              {`${
                campaignData.guide.totalPayed ? campaignData.guide.totalPayed.toFixed(3) : 0
              } HIVE`}{' '}
              {`(${
                campaignData.guide.liquidHivePercent ? campaignData.guide.liquidHivePercent : 'n/a'
              }%)`}
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

CampaignCardHeader.propTypes = {
  intl: PropTypes.shape().isRequired,
  campaignData: PropTypes.shape().isRequired,
  match: PropTypes.shape().isRequired,
};

export default injectIntl(CampaignCardHeader);
