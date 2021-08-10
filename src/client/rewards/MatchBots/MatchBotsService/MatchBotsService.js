import * as React from 'react';
import PropTypes from 'prop-types';

import './MatchBotsService.less';

const MatchBotsService = ({ messageData, botName }) => (
  <div className="MatchBots__text-content">
    <p>
      <span className="fw6">{messageData.matchBotsFee}</span>
      <span>{messageData.matchBotsSupport}</span>
    </p>
    <div className="MatchBots__highlighted-block">
      <div className="MatchBots__text">
        <p className="fw6">
          <span>{messageData[`matchBots${botName}AuthText`]}</span>
          <span className="MatchBots__text-link">{messageData.matchBotsAuthLink}</span>
        </p>
        <p className="fw6 mb3">{messageData.matchBotsAuthHiveSigner}</p>
        <p>
          <span className="fw6">{messageData.disclaimer}</span>
          <span>{messageData[`matchBots${botName}Provided`]}</span>
        </p>
      </div>
    </div>
  </div>
);

MatchBotsService.propTypes = {
  messageData: PropTypes.shape().isRequired,
  botName: PropTypes.string.isRequired,
};

export default MatchBotsService;
