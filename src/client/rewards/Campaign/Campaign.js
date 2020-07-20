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
  rewardPriseCatalogWrap,
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
  const rewardPrise = minReward ? `${minReward.toFixed(2)} USD` : '';
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
                <span className="fw6 ml1">{rewardPrise || rewardPriseCatalogWrap}</span>
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
  filterKey: PropTypes.string.isRequired,
  // userName: PropTypes.string,
  history: PropTypes.shape().isRequired,
  rewardPriseCatalogWrap: PropTypes.string,
  rewardMaxCatalogWrap: PropTypes.string,
};

Campaign.defaultProps = {
  proposition: {},
  rewardPriseCatalogWrap: '',
  rewardMaxCatalogWrap: '',
};

export default injectIntl(withRouter(Campaign));
