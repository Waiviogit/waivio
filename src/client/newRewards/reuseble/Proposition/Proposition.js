import React, { useState } from 'react';
import PropTypes from 'prop-types';
import RewardsHeader from '../RewardsHeader';

import ObjectCardView from '../../../objectCard/ObjectCardView';
import DetailsModal from '../../DetailsModal/DetailsModal';
import PropositionFooter from './PropositionFooter';

import './Proposition.less';

const Proposition = ({ proposition, type }) => {
  const [openDetails, setOpenDitails] = useState(false);
  const onOpenDetailsModal = () => setOpenDitails(true);
  const propositionType = proposition.reserved ? 'reserved' : type;

  return (
    <div className="Proposition-new">
      <div className="Proposition-new__header">
        <RewardsHeader proposition={proposition} />
      </div>
      <ObjectCardView
        wObject={proposition.object}
        withRewards
        rewardPrice={proposition.rewardInUSD}
        payoutToken={proposition.payoutToken}
        isReserved={propositionType === 'reserved'}
        passedParent={proposition.requiredObject}
      />
      <PropositionFooter
        type={propositionType}
        countReservationDays={proposition?.countReservationDays}
        commentsCount={proposition?.commentsCount}
        openDetailsModal={onOpenDetailsModal}
        proposition={proposition}
      />
      {openDetails && (
        <DetailsModal
          proposition={{ ...proposition, reserved: propositionType === 'reserved' }}
          isModalDetailsOpen={openDetails}
          toggleModal={() => setOpenDitails(!openDetails)}
          reserveOnClickHandler={() => {}}
          removeToggleFlag={() => {}}
        />
      )}
    </div>
  );
};

Proposition.propTypes = {
  proposition: PropTypes.shape({
    rewardInUSD: PropTypes.number,
    guideName: PropTypes.string,
    reserved: PropTypes.bool,
    commentsCount: PropTypes.number,
    countReservationDays: PropTypes.number,
    totalPayed: PropTypes.number,
    payoutToken: PropTypes.string,
    object: PropTypes.shape({
      author_permlink: PropTypes.string,
    }),
    requiredObject: PropTypes.shape(),
    requirements: PropTypes.shape({
      minPhotos: PropTypes.string,
    }),
    _id: PropTypes.string,
  }).isRequired,
  type: PropTypes.string.isRequired,
};

export default Proposition;
