import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button } from 'antd';

import ObjectCardView from '../../../objectCard/ObjectCardView';
import DetailsModal from '../../DetailsModal/DetailsModal';

import './Proposition.less';

const Proposition = ({ proposition }) => {
  const [openDetails, setOpenDitails] = useState(false);

  return (
    <div className="Proposition-new">
      <div className="Proposition-new__header">
        <p className="Proposition-new__title">
          Share {proposition?.requirements?.minPhotos} photos of the dish and earn crypto
        </p>
        <div className="Proposition-new__sponsorInfo">
          <div className="Proposition-new__infoItem Proposition-new__infoItem--right">
            <Link to={`/@${proposition?.guideName}`}>Waivio Service (Sponsor)</Link>
            <Link to={`/@${proposition?.guideName}`}>@{proposition?.guideName}</Link>
          </div>
          <div className="Proposition-new__infoItem Proposition-new__infoItem--left">
            <span>Total paid (liquid):</span>
            <span>
              {proposition?.totalPayed || 0} {proposition?.payoutToken}
            </span>
          </div>
        </div>
      </div>
      <ObjectCardView
        wObject={proposition.object}
        withRewards
        rewardPrice={proposition.rewardInUSD}
      />
      <div className="Proposition-new__footer">
        <Button type="primary" onClick={() => setOpenDitails(true)}>
          <b>Reserve</b> Yor Reward
        </Button>{' '}
        for {proposition.countReservationDays} days
      </div>
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
};

export default Proposition;
