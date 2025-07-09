import { isEmpty } from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ObjectCardView from '../../../objectCard/ObjectCardView';
import Campaing from '../../../newRewards/reuseble/Campaing';
import PropositionNew from '../../../newRewards/reuseble/Proposition/Proposition';

const WobjCardSwitcher = React.memo(props => {
  if (!isEmpty(props.obj.propositions)) {
    const proposition = props.obj.propositions[0];

    return (
      <PropositionNew
        type={proposition.reserved ? 'reserved' : ''}
        hovered
        socialMap={props.socialMap}
        proposition={{ ...proposition, object: props.obj }}
      />
    );
  }

  if (props.obj.campaigns) {
    return (
      <Campaing
        socialMap={props.socialMap}
        campain={{
          maxReward: props.obj.campaigns?.max_reward,
          minReward: props.obj.campaigns?.min_reward,
          object: props.obj,
        }}
        secondary={props.obj?.propositions?.[0]}
        hovered
      />
    );
  }

  return <ObjectCardView socialMap={props.socialMap} wObject={props.obj} hovered />;
});

WobjCardSwitcher.propTypes = {
  socialMap: PropTypes.bool,
  obj: PropTypes.shape({
    propositions: PropTypes.arrayOf(PropTypes.shape()),
    campaigns: PropTypes.arrayOf(PropTypes.shape()),
  }).isRequired,
};
WobjCardSwitcher.defaultProps = {
  socialMap: false,
};

export default connect(null)(WobjCardSwitcher);
