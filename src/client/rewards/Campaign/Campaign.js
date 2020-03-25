import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { injectIntl } from 'react-intl';
import { Button, Icon } from 'antd';
import { getClientWObj } from '../../adapters';
import { getCurrentUSDPrice } from '../rewardsHelper';
import ObjectCardView from '../../objectCard/ObjectCardView';
import { AppSharedContext } from '../../Wrapper';
import './Campaign.less';

const Campaign = ({ proposition, filterKey, history, intl, discover }) => {
  const { usedLocale } = useContext(AppSharedContext);
  const requiredObject = proposition.campaigns
    ? getClientWObj(proposition, usedLocale)
    : getClientWObj(proposition.required_object, usedLocale);
  const currentUSDPrice = getCurrentUSDPrice();
  const minReward = proposition.campaigns
    ? proposition.campaigns.min_reward
    : proposition.min_reward;
  const maxReward = proposition.campaigns
    ? proposition.campaigns.max_reward
    : proposition.max_reward;
  const rewardPrise = currentUSDPrice
    ? `${(currentUSDPrice * minReward).toFixed(2)} USD`
    : `${maxReward} HIVE`;
  const rewardMax =
    // eslint-disable-next-line no-nested-ternary
    maxReward !== minReward
      ? currentUSDPrice
        ? `${(currentUSDPrice * maxReward).toFixed(2)} USD`
        : `${maxReward} HIVE`
      : '';
  const isDiscover = discover;
  const goToProducts = () => {
    history.push(`/rewards/${isDiscover ? 'all' : filterKey}/${requiredObject.id}`);
  };

  return (
    <div className="Campaign">
      <ObjectCardView wObject={requiredObject} key={requiredObject.id} />
      <div className="Campaign__button" role="presentation" onClick={goToProducts}>
        <Button type="primary" size="large">
          {!rewardMax ? (
            <React.Fragment>
              <span>
                {intl.formatMessage({
                  id: 'rewards_details_earn',
                  defaultMessage: 'Earn',
                })}
              </span>
              <span>
                <span className="fw6 ml1">{rewardPrise}</span>
                <Icon type="right" />
              </span>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <span>
                {intl.formatMessage({
                  id: 'rewards_details_earn_up_to',
                  defaultMessage: 'Earn up to',
                })}
              </span>
              <span>
                <span className="fw6 ml1">{`${rewardMax}`}</span>
                {' USD '}
                <Icon type="right" />
              </span>
            </React.Fragment>
          )}
        </Button>
      </div>
    </div>
  );
};

Campaign.propTypes = {
  proposition: PropTypes.shape(),
  intl: PropTypes.shape().isRequired,
  filterKey: PropTypes.string.isRequired,
  history: PropTypes.shape().isRequired,
  discover: PropTypes.string.isRequired,
};

Campaign.defaultProps = {
  proposition: {},
};

export default injectIntl(withRouter(Campaign));
