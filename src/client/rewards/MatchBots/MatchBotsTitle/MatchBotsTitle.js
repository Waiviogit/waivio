import Cookie from 'js-cookie';
import React, { useEffect, useState } from 'react';
import { isNil } from 'lodash';
import PropTypes from 'prop-types';
import { Switch, Tooltip } from 'antd';
import { useDispatch } from 'react-redux';

import { redirectAuthHiveSigner } from '../../../../common/helpers/matchBotsHelpers';
import { getGuestAuthorityStatus, toggleBots } from '../../../../store/authStore/authActions';

import './MatchBotsTitle.less';

const MatchBotsTitle = ({
  isAuthority,
  botTitle,
  turnOffTitle,
  turnOnTitle,
  botType,
  isGuest,
  authUserName,
}) => {
  const [waiting, setWaiting] = useState(false);
  const dispatch = useDispatch();
  const handleRedirect = () => {
    if (Cookie.get('auth')) {
      setWaiting(true);
      dispatch(toggleBots(botType, isAuthority)).then(() => {
        setWaiting(false);
      });
    } else if (isGuest) {
      setWaiting(true);
      dispatch(toggleBots(botType, isAuthority))
        .then(() => setWaiting(false))
        .catch(() => setWaiting(false));
    } else {
      redirectAuthHiveSigner(isAuthority, botType);
    }
  };

  useEffect(() => {
    if (isNil(isAuthority) && isGuest) {
      dispatch(getGuestAuthorityStatus(authUserName));
    }
  }, []);

  return (
    <div className="MatchBots__title-wrap">
      <div className="MatchBots__title">{botTitle}</div>
      <div className="MatchBots__switcher">
        <Tooltip title={!isAuthority ? turnOnTitle : turnOffTitle}>
          <Switch disabled={waiting} checked={isAuthority} onChange={handleRedirect} />
        </Tooltip>
      </div>
    </div>
  );
};

MatchBotsTitle.propTypes = {
  isAuthority: PropTypes.bool,
  isGuest: PropTypes.bool,
  botType: PropTypes.string.isRequired,
  botTitle: PropTypes.string.isRequired,
  turnOffTitle: PropTypes.string,
  turnOnTitle: PropTypes.string,
  authUserName: PropTypes.string,
};

MatchBotsTitle.defaultProps = {
  isAuthority: false,
  handleSwitcher: () => {},
  turnOffTitle: 'Turn off',
  turnOnTitle: 'Turn on',
};

export default MatchBotsTitle;
