import classNames from 'classnames';
import Cookie from 'js-cookie';
import { useState } from 'react';
import * as React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { connect, useDispatch } from 'react-redux';

import { redirectAuthHiveSigner } from '../../../../common/helpers/matchBotsHelpers';

import './MatchBotsService.less';
import { toggleBots } from '../../../../store/authStore/authActions';
import {
  getGuestAuthority,
  getIsConnectMatchBot,
  isGuestUser,
} from '../../../../store/authStore/authSelectors';

const MatchBotsService = ({ intl, isAuthority, botType, botName, onlyAuth, isGuest }) => {
  const dispatch = useDispatch();
  const [waiting, setWaiting] = useState(false);
  const handleAuthHiveSigner = () => {
    if (waiting) return;

    if (Cookie.get('auth')) {
      setWaiting(true);
      dispatch(toggleBots(botType, isAuthority)).then(() => setWaiting(false));
    } else if (isGuest) {
      setWaiting(true);
      dispatch(toggleBots(botType, isAuthority))
        .then(() => setWaiting(false))
        .catch(() => setWaiting(false));
    } else {
      redirectAuthHiveSigner(isAuthority, botType);
    }
  };

  return (
    <div className="MatchBots__text-content">
      <div
        className={classNames('MatchBots__highlighted-block', {
          'MatchBots__highlighted-block--withoutBorder': onlyAuth,
        })}
      >
        <div className="MatchBots__text">
          <div className="fw6 mb3">
            <b>
              <span>{intl.formatMessage({ id: `match_bots_${botName}_auth_text` })}</span>{' '}
              <span
                className={classNames('MatchBots__text-link', {
                  'MatchBots__text-link--disabled': waiting,
                })}
                onClick={handleAuthHiveSigner}
              >
                {intl.formatMessage({
                  id: isAuthority ? 'match_bots_unauth_link' : 'match_bots_auth_link',
                })}
              </span>
              .
            </b>
            <br />
            <b>
              {intl.formatMessage({
                id: 'match_bots_auth_hivesigner',
                defaultMessage:
                  'Authorization is handled via HiveSigner and can be revoked at any time.',
              })}
            </b>
          </div>
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
  onlyAuth: PropTypes.bool,
  isGuest: PropTypes.bool,
};

MatchBotsService.defaultProps = {
  onlyAuth: false,
};

const mapStateToProps = (state, props) => {
  const isGuest = isGuestUser(state);

  return {
    isAuthority: isGuest ? getGuestAuthority(state) : getIsConnectMatchBot(state, props),
    isGuest: isGuestUser(state),
  };
};

export default injectIntl(connect(mapStateToProps)(MatchBotsService));
