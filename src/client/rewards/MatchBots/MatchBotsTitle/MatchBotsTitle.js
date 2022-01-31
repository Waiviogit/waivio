import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Tooltip } from 'antd';

import { redirectAuthHiveSigner } from '../../../../common/helpers/matchBotsHelpers';

import './MatchBotsTitle.less';

const MatchBotsTitle = ({ isAuthority, botTitle, turnOffTitle, turnOnTitle, botType }) => {
  const handleRedirect = () => redirectAuthHiveSigner(isAuthority, botType);

  return (
    <div className="MatchBots__title-wrap">
      <div className="MatchBots__title">{botTitle}</div>
      <div className="MatchBots__switcher">
        <Tooltip title={!isAuthority ? turnOnTitle : turnOffTitle}>
          <Switch checked={isAuthority} onChange={handleRedirect} />
        </Tooltip>
      </div>
    </div>
  );
};

MatchBotsTitle.propTypes = {
  isAuthority: PropTypes.bool,
  botType: PropTypes.string.isRequired,
  botTitle: PropTypes.string.isRequired,
  turnOffTitle: PropTypes.string,
  turnOnTitle: PropTypes.string,
};

MatchBotsTitle.defaultProps = {
  isAuthority: false,
  handleSwitcher: () => {},
  turnOffTitle: 'Turn off',
  turnOnTitle: 'Turn on',
};

export default MatchBotsTitle;
