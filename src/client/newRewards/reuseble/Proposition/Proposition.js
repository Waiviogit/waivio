import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import classNames from 'classnames';
import RewardsHeader from '../RewardsHeader';
import ObjectCardView from '../../../objectCard/ObjectCardView';
import DetailsModal from '../../DetailsModal/DetailsModal';
import PropositionFooter from './PropositionFooter';

import './Proposition.less';

const Proposition = ({ proposition, type, getProposition, hovered }) => {
  const [openDetails, setOpenDitails] = useState(false);
  const onOpenDetailsModal = () => setOpenDitails(true);
  const propositionType =
    proposition.reserved || proposition?.reviewStatus === 'assigned' ? 'reserved' : type;
  const propositionClassList = classNames('Proposition-new', {
    'Proposition-new--hovered': hovered,
  });

  return (
    <div className={propositionClassList}>
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
        getProposition={getProposition}
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
    reviewStatus: PropTypes.string,
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
  hovered: PropTypes.bool,
  type: PropTypes.string,
  getProposition: PropTypes.func,
};

Proposition.defaultProps = {
  getProposition: noop,
  type: '',
  hovered: false,
};

export default Proposition;
