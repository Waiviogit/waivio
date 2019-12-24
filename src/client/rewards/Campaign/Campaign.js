import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { injectIntl } from 'react-intl';
import { Button, Icon } from 'antd';
import { getClientWObj } from '../../adapters';
import { convertDigits, getCurrentUSDPrice } from '../rewardsHelper';
import ObjectCardView from '../../objectCard/ObjectCardView';
import { UsedLocaleContext } from '../../Wrapper';
import './Campaign.less';

const Campaign = ({ proposition, filterKey, history, intl }) => {
  const usedLocale = useContext(UsedLocaleContext);
  const requiredObject = getClientWObj(proposition.required_object, usedLocale);
  const currentUSDPrice = getCurrentUSDPrice();
  const rewardPrise = currentUSDPrice
    ? convertDigits(currentUSDPrice * proposition.min_reward)
    : '...';
  const rewardMax =
    proposition.max_reward !== proposition.min_reward
      ? ` - ${convertDigits(proposition.max_reward)}`
      : '';
  const goToProducts = () => history.push(`/rewards/${filterKey}/${requiredObject.id}`);
  return (
    <div className="Campaign">
      <div className="RewardsHeader-block">
        <div className="RewardsHeader-wrap">
          {`${intl.formatMessage({
            id: 'rewards_for_reviews',
            defaultMessage: `Rewards for review`,
          })}:`}
          <span className="RewardsHeader-payment">
            {`${proposition.min_reward} ${
              proposition.max_reward !== proposition.min_reward
                ? ` - ${proposition.max_reward}`
                : ''
            } STEEM`}
          </span>
        </div>
      </div>
      <ObjectCardView wObject={requiredObject} key={requiredObject.id} />
      <div className="Campaign__button" role="presentation" onClick={goToProducts}>
        <Button type="primary" size="large">
          <span>
            {intl.formatMessage({
              id: 'rewards_details_earn_up_to',
              defaultMessage: 'Earn up to',
            })}
          </span>
          <span>
            <span className="fw6 ml1">{`${rewardPrise} ${rewardMax}`}</span>
            {' USD '}
            <Icon type="right" />
          </span>
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
};

Campaign.defaultProps = {
  proposition: {},
};

export default injectIntl(withRouter(Campaign));
