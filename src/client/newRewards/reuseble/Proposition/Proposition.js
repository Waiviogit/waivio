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

  return (
    <div className="Proposition-new">
      <div className="Proposition-new__header">
        <RewardsHeader proposition={proposition} />
      </div>
      <ObjectCardView
        wObject={proposition.object}
        withRewards
        rewardPrice={proposition.rewardInUSD}
      />
      <PropositionFooter
        type={proposition.reserved ? 'reserved' : type}
        countReservationDays={proposition?.countReservationDays}
        commentsCount={proposition?.commentsCount}
        openDetailsModal={onOpenDetailsModal}
      />
      {openDetails && (
        <DetailsModal
          proposition={proposition}
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
    requirements: PropTypes.shape({
      minPhotos: PropTypes.string,
    }),
    _id: PropTypes.string,
  }).isRequired,
  type: PropTypes.string.isRequired,
};

export default Proposition;
