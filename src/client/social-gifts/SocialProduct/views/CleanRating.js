import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import { averageRate } from '../../../components/Sidebar/Rate/rateHelper';

import './CleanRating.less';

const CleanRating = ({ rating }) => {
  const ratingValue = averageRate(rating) * 2;
  const formattedRating = ratingValue > 0 ? ratingValue.toFixed(1) : '0.0';

  return (
    <div className="CleanRating">
      <Icon type="star" theme="filled" className="CleanRating__star" />
      <span className="CleanRating__value">{formattedRating} / 10</span>
      <span className="CleanRating__label">{rating.body}</span>
    </div>
  );
};

CleanRating.propTypes = {
  rating: PropTypes.shape({
    body: PropTypes.string,
    rating_votes: PropTypes.arrayOf(PropTypes.shape()),
  }).isRequired,
};

export default CleanRating;
