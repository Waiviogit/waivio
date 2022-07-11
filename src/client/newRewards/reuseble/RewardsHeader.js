import { Link } from 'react-router-dom';
import React from 'react';
import PropTypes from 'prop-types';

const RewardsHeader = ({ proposition }) => (
  <div>
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
);

RewardsHeader.propTypes = {
  proposition: PropTypes.shape({
    guideName: PropTypes.string,
    totalPayed: PropTypes.string,
    payoutToken: PropTypes.string,
    requirements: PropTypes.shape({
      minPhotos: PropTypes.number,
    }),
  }).isRequired,
};

export default RewardsHeader;
