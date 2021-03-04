import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { has, get } from 'lodash';
import { injectIntl } from 'react-intl';
import { Button, Icon } from 'antd';
import ObjectCardView from '../../objectCard/ObjectCardView';

import './Campaign.less';

const Campaign = ({
  proposition,
  filterKey,
  history,
  intl,
  rewardPricePassed,
  rewardMaxPassed,
}) => {
  const hasCampaigns = has(proposition, ['campaigns']);
  const campaign = hasCampaigns ? get(proposition, 'campaigns') : proposition;
  const requiredObject = hasCampaigns ? proposition : get(proposition, ['required_object'], {});
  const minReward = get(campaign, ['min_reward'], 0);
  const maxReward = get(campaign, ['max_reward'], 0);
  const rewardPrice = minReward ? `${minReward.toFixed(2)} USD` : '';
  const rewardMax = maxReward !== minReward ? `${maxReward.toFixed(2)} USD` : '';
  const goToProducts = () =>
    history.push(`/rewards/${filterKey}/${requiredObject.author_permlink}`);

  return (
    <div className="Campaign">
      <ObjectCardView
        wObject={requiredObject}
        key={requiredObject.id}
        passedParent={requiredObject.parent}
      />
      <div className="Campaign__button" role="presentation" onClick={goToProducts}>
        <Button type="primary" size="large">
          {!rewardMax && !rewardMaxPassed ? (
            <React.Fragment>
              <span>
                {intl.formatMessage({
                  id: 'rewards_details_earn',
                  defaultMessage: 'Earn',
                })}
              </span>
              <span>
                <span className="fw6 ml1">{rewardPrice || rewardPricePassed}</span>
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
                <span className="fw6 ml1">{rewardMax || rewardMaxPassed}</span>
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
};

Campaign.defaultProps = {
  proposition: {},
  rewardPricePassed: '',
  rewardMaxPassed: '',
  filterKey: '',
};

export default injectIntl(withRouter(Campaign));
