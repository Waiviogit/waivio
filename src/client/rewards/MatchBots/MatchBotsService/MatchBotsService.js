import * as React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import { redirectAuthHiveSigner } from '../../../helpers/matchBotsHelpers';

import './MatchBotsService.less';

const MatchBotsService = ({ intl, botName, isAuthority, botType }) => {
  const handleAuthHiveSigner = () => redirectAuthHiveSigner(isAuthority, botType);

  return (
    <div className="MatchBots__text-content">
      <p>
        <span className="fw6">{intl.formatMessage({ id: 'match_bots_fee' })}</span>
        <span>{intl.formatMessage({ id: 'match_bots_support' })}</span>
      </p>
      <div className="MatchBots__highlighted-block">
        <div className="MatchBots__text">
          <p className="fw6">
            <span>{intl.formatMessage({ id: `match_bots_${botName}_auth_text` })}</span>
            <span className="MatchBots__text-link" onClick={handleAuthHiveSigner}>
              {intl.formatMessage({
                id: isAuthority ? 'match_bots_unauth_link' : 'match_bots_auth_link',
              })}
            </span>
          </p>
          <p className="fw6 mb3">{intl.formatMessage({ id: 'match_bots_auth_hivesigner' })}</p>
          <p>
            <span className="fw6">
              {intl.formatMessage({ id: 'matchBot_sponsors_disclaimer' })}
            </span>
            <span>{intl.formatMessage({ id: `matchBot_${botName}_provided` })}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

MatchBotsService.propTypes = {
  intl: PropTypes.shape().isRequired,
  botName: PropTypes.string.isRequired,
  botType: PropTypes.string.isRequired,
  isAuthority: PropTypes.bool.isRequired,
};

export default injectIntl(MatchBotsService);
