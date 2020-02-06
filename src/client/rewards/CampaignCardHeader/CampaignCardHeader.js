import React from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Avatar from '../../components/Avatar';
import { getCurrentUSDPrice } from '../rewardsHelper';
import './CampaignCardHeader.less';

const CampaignCardHeader = ({ intl, campaignData, isDetails }) => {
  const currentUSDPrice = getCurrentUSDPrice();
  const rewardPrise = currentUSDPrice
    ? `${(currentUSDPrice * campaignData.reward).toFixed(2)} USD`
    : `${campaignData.reward} STEEM`;
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
            })}
          </span>
          {!isDetails ? (
            <React.Fragment>
              <span className="CampaignCardHeader__data-colored">
                <span className="fw6">{` ${rewardPrise} `}</span>
              </span>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <span className="CampaignCardHeader__data-colored">
                <span className="fw6">{` ${campaignData.reward} `}</span>
                <span>STEEM</span>
              </span>
              {currentUSDPrice && (
                <span>
                  {' '}
                  (<span className="fw6">{rewardPrise}</span>)
                </span>
              )}
            </React.Fragment>
          )}
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
            <div>{intl.formatMessage({ id: 'paid', defaultMessage: 'Total paid' })}</div>
            <div className="total-paid__colon">:</div>
            <div>{`${
              campaignData.guide.totalPayed ? campaignData.guide.totalPayed.toFixed(3) : 0
            } STEEM`}</div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

CampaignCardHeader.propTypes = {
  intl: PropTypes.shape().isRequired,
  campaignData: PropTypes.shape().isRequired,
  isDetails: PropTypes.bool,
};
CampaignCardHeader.defaultProps = {
  isDetails: false,
};

export default injectIntl(CampaignCardHeader);
