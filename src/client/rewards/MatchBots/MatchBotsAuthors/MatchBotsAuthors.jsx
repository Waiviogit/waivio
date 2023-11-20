import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { getAccount } from '../../../../common/helpers/apiHelpers';

import MatchBotsTitle from '../MatchBotsTitle';
import MatchBotsTable from '../MatchBotsTable';
import MatchBotsService from '../MatchBotsService';
import ModalsAuthors from '../MatchBotsModals/ModalsAuthors';
import MatchBotsAuthorsContent from './MatchBotsAuthorsContent';
import { MATCH_BOTS_NAMES, MATCH_BOTS_TYPES } from '../../../../common/helpers/matchBotsHelpers';

import '../MatchBots.less';

const MatchBotsAuthors = ({
  intl,
  isEngLocale,
  isAuthority,
  getMatchBots,
  matchBots,
  clearMatchBots,
  authUserName,
  reload,
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

    return () => clearMatchBots();
  }, []);

  return (
    <div className="MatchBots">
      <MatchBotsTitle
        isAuthBot={isAuthBot}
        botType={MATCH_BOTS_TYPES.AUTHORS}
        botTitle={intl.formatMessage({
          id: 'matchBot_title_authors',
          defaultMessage: ' Authors match bot',
        })}
        turnOffTitle={intl.formatMessage({ id: 'matchBot_turn_off', defaultMessage: 'Turn off' })}
        turnOnTitle={intl.formatMessage({ id: 'matchBot_turn_on', defaultMessage: 'Turn on' })}
      />
      <MatchBotsAuthorsContent isEngLocale={isEngLocale} />
      <MatchBotsService
        botName={MATCH_BOTS_NAMES.AUTHORS}
        isAuthority={isAuthBot}
        botType={MATCH_BOTS_TYPES.AUTHORS}
      />
      <ModalsAuthors modalType="add" />
      {!!matchBots.length && (
        <MatchBotsTable type={MATCH_BOTS_NAMES.AUTHORS} botType={MATCH_BOTS_TYPES.AUTHORS} />
      )}
    </div>
  );
};

MatchBotsAuthors.propTypes = {
  intl: PropTypes.shape().isRequired,
  isEngLocale: PropTypes.bool.isRequired,
  authUserName: PropTypes.string.isRequired,
  isAuthority: PropTypes.bool.isRequired,
  getMatchBots: PropTypes.func.isRequired,
  clearMatchBots: PropTypes.func.isRequired,
  reload: PropTypes.func.isRequired,
  matchBots: PropTypes.arrayOf(PropTypes.shape()),
};

MatchBotsAuthors.defaultProps = {
  matchBots: [],
};

export default injectIntl(MatchBotsAuthors);
