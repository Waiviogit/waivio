import { isEmpty } from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Proposition from '../../../rewards/Proposition/Proposition';
import Campaign from '../../../rewards/Campaign/Campaign';
import ObjectCardView from '../../../objectCard/ObjectCardView';
import { assignProposition, declineProposition } from '../../../../store/userStore/userActions';

const WobjCardSwitcher = React.memo(props => {
  if (!isEmpty(props.obj.propositions)) {
    const proposition = props.obj.propositions[0];

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

  if (props.obj.campaigns) return <Campaign proposition={props.obj} filterKey="all" hovered />;

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
