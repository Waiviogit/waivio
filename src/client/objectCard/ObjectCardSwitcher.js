import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { isEmpty } from 'lodash';
import ObjectCardView from './ObjectCardView';
import PropositionNew from '../newRewards/reuseble/Proposition/Proposition';
import Campaing from '../newRewards/reuseble/Campaing';

const ObjectCardSwitcher = ({ wObj, intl }) => {
  if (wObj.campaigns) {
    return (
      <Campaing
        key={wObj.author_permlink}
        campain={{ ...wObj.campaigns, object: wObj }}
        secondary={wObj?.propositions}
      />
    );
  }

  if (wObj.propositions && wObj.propositions.length) {
    // eslint-disable-next-line array-callback-return,consistent-return
    return wObj.propositions.map(proposition => (
      <PropositionNew
        type={proposition.reserved ? 'reserved' : ''}
        key={proposition._id}
        proposition={{
          ...proposition,
          requiredObject: !isEmpty(wObj.parent) ? wObj.parent : proposition?.requiredObject,
          object: wObj,
        }}
      />
    ));
  }

  return <ObjectCardView key={wObj.id} wObject={wObj} passedParent={wObj.parent} intl={intl} />;
};

ObjectCardSwitcher.propTypes = {
  wObj: PropTypes.shape().isRequired,
  intl: PropTypes.shape(),
};

export default injectIntl(ObjectCardSwitcher);
