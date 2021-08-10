import * as React from 'react';
import PropTypes from 'prop-types';

const MatchBotsCuratorsContent = ({ messageData, isEngLocale }) => (
  <div className="MatchBot__text-content">
    <p>
      {isEngLocale && <span>The</span>}
      <span className="fw6">{messageData.titleBotsCurators} </span>
      <span>{messageData.curatorsMatchBotsMeaning}</span>
    </p>
    <p>{messageData.curatorsMatchBotsCommand}</p>
    <p>{messageData.curatorsMatchBotsImportant}</p>
    <p>{messageData.curatorsMatchBotsCondition}</p>
    <p>{messageData.curatorsMatchBotsVotes}</p>
  </div>
);

MatchBotsCuratorsContent.propTypes = {
  messageData: PropTypes.shape().isRequired,
  isEngLocale: PropTypes.bool.isRequired,
};

export default MatchBotsCuratorsContent;
