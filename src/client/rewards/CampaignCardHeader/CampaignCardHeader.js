import React from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { get, includes } from 'lodash';
import Avatar from '../../components/Avatar';
import { GUIDE_HISTORY, MESSAGES, HISTORY, ASSIGNED } from '../../../common/constants/rewards';
import { getCurrentUSDPrice } from '../rewardsHelper';
import './CampaignCardHeader.less';

const CampaignCardHeader = ({ intl, campaignData, match, isWobjAssigned, wobjPrice }) => {
  const currentUSDPrice = getCurrentUSDPrice();
  const price = get(campaignData, ['0', 'objects', '0', 'reward']) || wobjPrice;
  const isAssigned = get(campaignData, ['0', 'objects', '0', ASSIGNED]) || isWobjAssigned;
  const isMessages =
    match &&
    (includes(match.url, HISTORY) ||
      includes(match.url, GUIDE_HISTORY) ||
      includes(match.url, MESSAGES));
  const campaignDataReward = get(campaignData, ['reward']) || get(campaignData, ['0', 'reward']);
  const rewardPriceHive = `${
    price ? price.toFixed(3) : (campaignDataReward / currentUSDPrice).toFixed(3)
  } HIVE`;
  const rewardPriceUsd = `${campaignDataReward} USD`;
  const rewardPrice = isAssigned || isMessages ? rewardPriceHive : rewardPriceUsd;
  const guideAlias =
    get(campaignData, ['guide', 'alias']) || get(campaignData, ['0', 'guide', 'alias']);
  const guideName =
    get(campaignData, ['guide', 'name']) || get(campaignData, ['0', 'guide', 'name']);
  const totalPayed =
    get(campaignData, ['guide', 'totalPayed']) || get(campaignData, ['0', 'guide', 'totalPayed']);
  const liquidHivePercent =
    get(campaignData, ['guide', 'liquidHivePercent']) ||
    get(campaignData, ['0', 'guide', 'liquidHivePercent']);
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
        <Link to={`/@${guideName}`}>
          <Avatar username={guideName} size={44} />
        </Link>
        <div className="user-info__content">
          <Link to={`/@${guideName}`} title={guideName}>
            <div className="username">
              {guideAlias} ({intl.formatMessage({ id: 'sponsor', defaultMessage: 'Sponsor' })})
            </div>
            <div className="username">{`@${guideName}`}</div>
          </Link>
          <div className="total-paid">
            <div className="total-paid__liquid">
              {intl.formatMessage({
                id: 'total_paid_liquid',
                defaultMessage: 'Total paid (liquid)',
              })}
              :
            </div>
            <div className="total-paid__currency">
              {`${totalPayed ? totalPayed.toFixed(3) : 0} HIVE`}{' '}
              {`(${liquidHivePercent || 'n/a'}%)`}
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

CampaignCardHeader.propTypes = {
  intl: PropTypes.shape().isRequired,
  campaignData: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  match: PropTypes.shape(),
  isWobjAssigned: PropTypes.bool,
  wobjPrice: PropTypes.number,
};

CampaignCardHeader.defaultProps = {
  isWobjAssigned: false,
  wobjPrice: 0,
  match: {},
};

export default injectIntl(CampaignCardHeader);
