import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import './Campaign.less';
import ObjectCard from '../../components/Sidebar/ObjectCard';
import { getClientWObj } from '../../adapters';

const Campaign = ({ proposition, filterKey, history }) => {
  const requiredObject = getClientWObj(proposition.required_object);

  const goToProducts = () => history.push(`/rewards/${filterKey}/${requiredObject.id}`);
  return (
    <div role="presentation" className="Campaign" onClick={goToProducts}>
      <ObjectCard
        key={requiredObject.author_permlink}
        wobject={requiredObject}
        showFollow={false}
      />
      <div>{proposition.count}</div>
    </div>
  );
};

Campaign.propTypes = {
  proposition: PropTypes.shape().isRequired,
  filterKey: PropTypes.string.isRequired,
  // userName: PropTypes.string,
  history: PropTypes.shape().isRequired,
};

// Campaign.defaultProps = {
//   userName: '',
// };

export default withRouter(Campaign);
