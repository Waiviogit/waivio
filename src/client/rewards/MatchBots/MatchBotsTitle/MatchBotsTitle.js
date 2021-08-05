import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Tooltip } from 'antd';

const MatchBotsTitle = ({ isAuthority, handleSwitcher, botTitle, turnOffTitle, turnOnTitle }) => (
  <div className="MatchBots__title-wrap">
    <div className="MatchBots__title">{botTitle}</div>
    <div className="MatchBots__switcher">
      <Tooltip title={!isAuthority ? turnOnTitle : turnOffTitle}>
        <Switch checked={isAuthority} onChange={handleSwitcher} />
      </Tooltip>
    </div>
  </div>
);

MatchBotsTitle.propTypes = {
  isAuthority: PropTypes.bool,
  handleSwitcher: PropTypes.func,
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
