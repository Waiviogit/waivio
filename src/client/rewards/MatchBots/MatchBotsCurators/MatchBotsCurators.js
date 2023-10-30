import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import MatchBotsTitle from '../MatchBotsTitle';
import MatchBotsService from '../MatchBotsService';
import ModalsCurators from '../MatchBotsModals/ModalsCurators';
import MatchBotsCuratorsContent from './MatchBotsCuratorsContent';
import { MATCH_BOTS_NAMES, MATCH_BOTS_TYPES } from '../../../../common/helpers/matchBotsHelpers';

import '../MatchBots.less';
import MatchBotsTable from '../MatchBotsTable';
import { getAccount } from '../../../../common/helpers/apiHelpers';

const MatchBotsCurators = ({
  intl,
  isEngLocale,
  isAuthority,
  getMatchBots,
  matchBots,
  authUserName,
  reload,
  clearMatchBots,
}) => {
  const [isAuthBot, setIsAuth] = useState(isAuthority);

  useEffect(() => {
    getMatchBots();
    getAccount(authUserName).then(r => {
      setIsAuth(r?.posting?.account_auths?.some(acc => acc[0] === MATCH_BOTS_TYPES.AUTHORS));
    });
    if (isAuthority !== isAuthBot) {
      reload();
    }

    return () => {
      clearMatchBots();
    };
  }, []);

  return (
    <div className="MatchBots">
      <MatchBotsTitle
        isAuthBot={isAuthBot}
        botType={MATCH_BOTS_TYPES.CURATORS}
        botTitle={intl.formatMessage({
          id: 'matchBot_title_curators',
          defaultMessage: ' Curators match bot',
        })}
        turnOffTitle={intl.formatMessage({ id: 'matchBot_turn_off', defaultMessage: 'Turn off' })}
        turnOnTitle={intl.formatMessage({ id: 'matchBot_turn_on', defaultMessage: 'Turn on' })}
      />
      <MatchBotsCuratorsContent isEngLocale={isEngLocale} />
      <MatchBotsService
        isAuthority={isAuthBot}
        botName={MATCH_BOTS_NAMES.CURATORS}
        botType={MATCH_BOTS_TYPES.CURATORS}
      />
      <ModalsCurators modalType="add" />
      {!!matchBots.length && (
        <MatchBotsTable type={MATCH_BOTS_NAMES.CURATORS} botType={MATCH_BOTS_TYPES.CURATORS} />
      )}
    </div>
  );
};

MatchBotsCurators.propTypes = {
  intl: PropTypes.shape().isRequired,
  authUserName: PropTypes.string.isRequired,
  isEngLocale: PropTypes.bool.isRequired,
  isAuthority: PropTypes.bool.isRequired,
  matchBots: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  getMatchBots: PropTypes.func.isRequired,
  clearMatchBots: PropTypes.func.isRequired,
  reload: PropTypes.func.isRequired,
};

export default injectIntl(MatchBotsCurators);
