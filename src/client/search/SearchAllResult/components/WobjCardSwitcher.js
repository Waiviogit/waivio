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

    if (proposition?.newCampaigns)
      return <PropositionNew hovered proposition={{ ...proposition, object: props.obj }} />;
  }

  if (props.obj.campaigns) {
    if (props.obj.campaigns?.newCampaigns)
      return (
        <Campaing
          campain={{
            maxReward: props.obj.campaigns?.max_reward,
            minReward: props.obj.campaigns?.min_reward,
            object: props.obj,
          }}
          hovered
        />
      );
  }

  return <ObjectCardView wObject={props.obj} hovered />;
});

WobjCardSwitcher.propTypes = {
  obj: PropTypes.shape({
    propositions: PropTypes.arrayOf(PropTypes.shape()),
    campaigns: PropTypes.arrayOf(PropTypes.shape()),
  }).isRequired,
};

export default connect(null)(WobjCardSwitcher);
