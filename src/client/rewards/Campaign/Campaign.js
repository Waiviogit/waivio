import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { injectIntl } from 'react-intl';
import { getClientWObj } from '../../adapters';
import ObjectCardView from '../../objectCard/ObjectCardView';
import { UsedLocaleContext } from '../../Wrapper';
import './Campaign.less';

const Campaign = ({ proposition, filterKey, history, intl }) => {
  const usedLocale = useContext(UsedLocaleContext);
  const requiredObject = getClientWObj(proposition.required_object, usedLocale);

  const goToProducts = () => history.push(`/rewards/${filterKey}/${requiredObject.id}`);
  return (
    <div role="presentation" className="Campaign" onClick={goToProducts}>
      <div className="RewardsHeader-wrap">
        {`${intl.formatMessage({
          id: 'rewards_for_reviews',
          defaultMessage: `Rewards for review`,
        })}:`}
        <span className="RewardsHeader-payment">
          {`$${proposition.min_reward} ${
            proposition.max_reward !== proposition.min_reward ? ` - $${proposition.max_reward}` : ''
          } >`}
        </span>
      </div>
      <ObjectCardView wObject={requiredObject} key={requiredObject.id} />
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
