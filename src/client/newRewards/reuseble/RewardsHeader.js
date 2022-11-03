import { Link } from 'react-router-dom';
import React from 'react';
import PropTypes from 'prop-types';
import { round } from 'lodash';

const RewardsHeader = ({ proposition }) => (
  <div>
    <p className="Proposition-new__title">
      Share {proposition?.requirements?.minPhotos} photos of the dish and earn crypto
    </p>
    <div className="Proposition-new__sponsorInfo">
      <div className="Proposition-new__infoItem Proposition-new__infoItem--right">
        <Link to={`/@${proposition?.guideName}`}>Sponsor</Link>
        <Link to={`/@${proposition?.guideName}`}>@{proposition?.guideName}</Link>
      </div>
      <div className="Proposition-new__infoItem">
        <span>Total paid (liquid):</span>
        <span>
          {round(proposition?.totalPayed || 0)} {proposition?.payoutToken} (100%)
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
