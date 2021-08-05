import React from 'react';
import PropTypes from 'prop-types';

const MatchBotsAuthorsContent = ({ messageData }) => (
  <div className="MatchBot__text-content">
    <p>{messageData.designedOffsetPortion}</p>
    <p>{messageData.contentUserPostedReview}</p>
  </div>
);

MatchBotsAuthorsContent.propTypes = {
  messageData: PropTypes.shape().isRequired,
};

export default MatchBotsAuthorsContent;
