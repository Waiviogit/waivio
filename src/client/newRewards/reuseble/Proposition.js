import React from 'react';
import PropTypes from 'prop-types';

import ObjectCardView from '../../objectCard/ObjectCardView';

import './Campaing.less';

const Proposition = ({ proposition }) => (
  <div className="Campaing">
    <ObjectCardView
      wObject={proposition.object}
      withRewards
      rewardPrice={proposition.rewardInUSD}
    />
  </div>
);

Proposition.propTypes = {
  proposition: PropTypes.shape({
    rewardInUSD: PropTypes.number,
    object: PropTypes.shape({
      author_permlink: PropTypes.string,
    }),
    _id: PropTypes.string,
  }).isRequired,
};

export default Proposition;
