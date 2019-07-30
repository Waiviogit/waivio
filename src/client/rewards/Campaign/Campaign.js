import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { injectIntl } from 'react-intl';
import './Campaign.less';
// import ObjectCard from '../../components/Sidebar/ObjectCard';
import { getClientWObj } from '../../adapters';
import ObjectCardView from '../../objectCard/ObjectCardView';

const Campaign = ({ proposition, filterKey, history, intl }) => {
  const requiredObject = getClientWObj(proposition.required_object);

  const goToProducts = () => history.push(`/rewards/${filterKey}/${requiredObject.id}`);
  return (
    <div role="presentation" className="Campaign" onClick={goToProducts}>
      <div className="RewarsHeader-wrap">
        {`${intl.formatMessage({
          id: 'rewards_for_rewiews',
          defaultMessage: `Rewards for rewiew`,
        })}:`}
        <span className="RewarsHeader-payment">{'$8.2 >'}</span>
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
