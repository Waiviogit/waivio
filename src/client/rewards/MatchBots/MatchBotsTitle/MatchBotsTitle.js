// import Cookie from 'js-cookie';
import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Tooltip } from 'antd';
// import { useDispatch } from 'react-redux';

import { redirectAuthHiveSigner } from '../../../../common/helpers/matchBotsHelpers';
// import { toggleBots } from '../../../../store/authStore/authActions';

import './MatchBotsTitle.less';

const MatchBotsTitle = ({ isAuthBot, botTitle, turnOffTitle, turnOnTitle, botType }) => {
  // const dispatch = useDispatch();
  const handleRedirect = () => {
    // Cookie.get('auth')
    //   ? dispatch(toggleBots(botType, isAuthBot))
    //   : redirectAuthHiveSigner(isAuthBot, botType);

    redirectAuthHiveSigner(isAuthBot, botType);
  };

  return (
    <div className="MatchBots__title-wrap">
      <div className="MatchBots__title">{botTitle}</div>
      <div className="MatchBots__switcher">
        <Tooltip title={!isAuthBot ? turnOnTitle : turnOffTitle}>
          <Switch checked={isAuthBot} onChange={handleRedirect} />
        </Tooltip>
      </div>
    </div>
  );
};

MatchBotsTitle.propTypes = {
  isAuthBot: PropTypes.bool,
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
