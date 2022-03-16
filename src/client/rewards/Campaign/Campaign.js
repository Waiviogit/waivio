import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { has, get } from 'lodash';
import { useSelector } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Button, Icon } from 'antd';
import ObjectCardView from '../../objectCard/ObjectCardView';
import { getCurrentCurrency, getIsWaivio } from '../../../store/appStore/appSelectors';
import { roundUpToThisIndex } from '../../../common/constants/waivio';

import './Campaign.less';
import USDDisplay from '../../components/Utils/USDDisplay';
import useQuickRewards from '../../../hooks/useQuickRewards';
import withAuthActions from '../../auth/withAuthActions';

const Campaign = ({
  proposition,
  filterKey,
  history,
  intl,
  rewardPricePassed,
  rewardMaxPassed,
  hovered,
  onActionInitiated,
}) => {
  const hasCampaigns = has(proposition, ['campaigns']);
  const currencyInfo = useSelector(getCurrentCurrency);
  const isWaivio = useSelector(getIsWaivio);
  const { setRestaurant, openModal } = useQuickRewards();
  const campaign = hasCampaigns ? get(proposition, 'campaigns') : proposition;
  const requiredObject = hasCampaigns ? proposition : get(proposition, ['required_object'], {});
  const minReward = get(campaign, ['min_reward'], 0);
  const maxReward = get(campaign, ['max_reward'], 0);
  const rewardMax = maxReward !== minReward ? maxReward : 0;
  let rewardPrice = minReward || rewardPricePassed || 0;

  if (campaign.reward) rewardPrice = get(campaign, 'reward', 0);

  const handleOpenQuickRewards = () =>
    onActionInitiated(() => {
      openModal();
      setRestaurant({
        ...requiredObject,
        campaigns: { min_reward: minReward, max_reward: maxReward },
      });
    });

  const goToProducts = () => {
    if (isWaivio) history.push(`/rewards/${filterKey}/${requiredObject.author_permlink}`);
    else {
      handleOpenQuickRewards();
    }
  };

  return (
    <div className="Campaign">
      <ObjectCardView
        wObject={requiredObject}
        passedParent={requiredObject.parent}
        hovered={hovered}
        withRewards
        rewardPrice={!rewardMax && !rewardMaxPassed ? rewardPrice : rewardMax}
      />
      <div className="Campaign__button" role="presentation" onClick={goToProducts}>
        <Button type="primary" size="large">
          {!rewardMax && !rewardMaxPassed ? (
            <React.Fragment>
              <span>
                {intl.formatMessage({
                  id: 'rewards_details_earn',
                  defaultMessage: 'Earn up',
                })}
              </span>
              <span>
                <span className="fw6 ml1">
                  <USDDisplay value={rewardPrice} currencyDisplay={'code'} />
                </span>
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
                <span className="fw6 ml1">
                  <USDDisplay
                    value={rewardMax || rewardMaxPassed}
                    currencyDisplay={'none'}
                    roundTo={roundUpToThisIndex}
                  />{' '}
                  {currencyInfo.type}
                </span>
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
  filterKey: PropTypes.string,
  history: PropTypes.shape().isRequired,
  rewardPricePassed: PropTypes.string,
  rewardMaxPassed: PropTypes.string,
  hovered: PropTypes.bool,
  onActionInitiated: PropTypes.func.isRequired,
};

Campaign.defaultProps = {
  proposition: {},
  rewardPricePassed: '',
  rewardMaxPassed: '',
  filterKey: '',
  hovered: false,
};

export default injectIntl(withRouter(withAuthActions(Campaign)));
