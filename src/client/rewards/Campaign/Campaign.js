import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { injectIntl } from 'react-intl';
import { Button, Icon } from 'antd';
import { getClientWObj } from '../../adapters';
import ObjectCardView from '../../objectCard/ObjectCardView';
import { AppSharedContext } from '../../Wrapper';
import './Campaign.less';

const Campaign = ({
  proposition,
  filterKey,
  history,
  intl,
  rewardPriceCatalogWrap,
  rewardMaxCatalogWrap,
}) => {
  const { usedLocale } = useContext(AppSharedContext);
  const requiredObject = proposition.campaigns
    ? getClientWObj(proposition, usedLocale)
    : getClientWObj(proposition.required_object, usedLocale);
  const minReward = proposition.campaigns
    ? proposition.campaigns.min_reward
    : proposition.min_reward;
  const maxReward = proposition.campaigns
    ? proposition.campaigns.max_reward
    : proposition.max_reward;
  const rewardPrice = minReward ? `${minReward.toFixed(2)} USD` : '';
  const rewardMax = maxReward !== minReward ? `${maxReward.toFixed(2)} USD` : '';
  const goToProducts = () => {
    history.push(`/rewards/${filterKey}/${requiredObject.id}`);
  };
  return (
    <div className="Campaign">
      <ObjectCardView wObject={requiredObject} key={requiredObject.id} />
      <div className="Campaign__button" role="presentation" onClick={goToProducts}>
        <Button type="primary" size="large">
          {!rewardMax && !rewardMaxCatalogWrap ? (
            <React.Fragment>
              <span>
                {intl.formatMessage({
                  id: 'rewards_details_earn',
                  defaultMessage: 'Earn',
                })}
              </span>
              <span>
                <span className="fw6 ml1">{rewardPrice || rewardPriceCatalogWrap}</span>
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
                <span className="fw6 ml1">{`${rewardMax || rewardMaxCatalogWrap}`}</span>
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
  rewardPriceCatalogWrap: PropTypes.string,
  rewardMaxCatalogWrap: PropTypes.string,
};

Campaign.defaultProps = {
  proposition: {},
  rewardPriceCatalogWrap: '',
  rewardMaxCatalogWrap: '',
  filterKey: '',
};

export default injectIntl(withRouter(Campaign));
