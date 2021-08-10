import * as React from 'react';
import PropTypes from 'prop-types';

import { redirectAuthHiveSigner } from '../../../helpers/matchBotsHelpers';

import './MatchBotsService.less';

const MatchBotsService = ({ messageData, botName, isAuthority, botType }) => {
  const handleAuthHiveSigner = () => redirectAuthHiveSigner(isAuthority, botType);

  return (
    <div className="MatchBots__text-content">
      <p>
        <span className="fw6">{messageData.matchBotsFee}</span>
        <span>{messageData.matchBotsSupport}</span>
      </p>
      <div className="MatchBots__highlighted-block">
        <div className="MatchBots__text">
          <p className="fw6">
            <span>{messageData[`matchBots${botName}AuthText`]}</span>
            <span className="MatchBots__text-link" onClick={handleAuthHiveSigner}>
              {isAuthority ? messageData.matchBotsUnAuthLink : messageData.matchBotsAuthLink}
            </span>
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
};

MatchBotsService.propTypes = {
  messageData: PropTypes.shape().isRequired,
  botName: PropTypes.string.isRequired,
  botType: PropTypes.string.isRequired,
  isAuthority: PropTypes.bool.isRequired,
};

export default MatchBotsService;
