import React from 'react';
import PropTypes from 'prop-types';

const MatchBotsAuthorsContent = ({ messageData, isEngLocale }) => (
  <div className="MatchBot__text-content">
    <p>
      {isEngLocale && <span>The</span>}
      <span className="fw6">{messageData.titleBotsAuthors} </span>
      <span>{messageData.authorsMatchBotsMeaning}</span>
    </p>
    <p>{messageData.authorsMatchBotsCommand}</p>
    <p>{messageData.authorsMatchBotsImportant}</p>
    <p>{messageData.authorsMatchBotsVotes}</p>
  </div>
);

MatchBotsAuthorsContent.propTypes = {
  messageData: PropTypes.shape().isRequired,
  isEngLocale: PropTypes.bool.isRequired,
};

export default MatchBotsAuthorsContent;
