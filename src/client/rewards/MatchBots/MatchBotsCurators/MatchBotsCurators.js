import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import MatchBotsTitle from '../MatchBotsTitle';
import MatchBotsService from '../MatchBotsService';
import ModalsCurators from '../MatchBotsModals/ModalsCurators';
import MatchBotsCuratorsContent from './MatchBotsCuratorsContent';
import { MATCH_BOTS_NAMES, MATCH_BOTS_TYPES } from '../../../helpers/matchBotsHelpers';

import '../MatchBots.less';
import MatchBotsTable from '../MatchBotsTable';

const MatchBotsCurators = ({
  intl,
  isEngLocale,
  isAuthority,
  getMatchBots,
  matchBots,
  clearMatchBots,
}) => {
  React.useEffect(() => {
    getMatchBots();

    return () => {
      clearMatchBots();
    };
  }, []);

  return (
    <div className="MatchBots">
      <MatchBotsTitle
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
        isAuthority={isAuthority}
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
  isEngLocale: PropTypes.bool.isRequired,
  isAuthority: PropTypes.bool.isRequired,
  matchBots: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  getMatchBots: PropTypes.func.isRequired,
  clearMatchBots: PropTypes.func.isRequired,
};

export default injectIntl(MatchBotsCurators);
