import { isEmpty } from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Proposition from '../../../rewards/Proposition/Proposition';
import Campaign from '../../../rewards/Campaign/Campaign';
import ObjectCardView from '../../../objectCard/ObjectCardView';
import { assignProposition, declineProposition } from '../../../../store/userStore/userActions';
import Campaing from '../../../newRewards/reuseble/Campaing';
import PropositionNew from '../../../newRewards/reuseble/Proposition/Proposition';

const WobjCardSwitcher = React.memo(props => {
  if (!isEmpty(props.obj.propositions)) {
    const proposition = props.obj.propositions[0];

    if (proposition?.newCampaigns) return <PropositionNew proposition={proposition} />;

    return (
      <Proposition
        proposition={proposition}
        wobj={props.obj}
        assigned={proposition.assigned}
        wobjPrice={proposition.reward}
        assignProposition={props.assignProposition}
        discardProposition={props.declineProposition}
        hovered
      />
    );
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
        />
      );

    return <Campaign proposition={props.obj} filterKey="all" hovered />;
  }

  return <ObjectCardView wObject={props.obj} hovered />;
});

WobjCardSwitcher.propTypes = {
  obj: PropTypes.shape({
    propositions: PropTypes.arrayOf(PropTypes.shape()),
    campaigns: PropTypes.arrayOf(PropTypes.shape()),
  }).isRequired,
  assignProposition: PropTypes.func.isRequired,
  declineProposition: PropTypes.func.isRequired,
};

export default connect(null, {
  declineProposition,
  assignProposition,
})(WobjCardSwitcher);
