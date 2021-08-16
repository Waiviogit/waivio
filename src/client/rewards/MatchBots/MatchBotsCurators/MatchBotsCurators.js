import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import MatchBotsTitle from '../MatchBotsTitle';
import MatchBotsService from '../MatchBotsService';
import ModalsCurators from '../MatchBotsModals/ModalsCurators';
import MatchBotsCuratorsContent from './MatchBotsCuratorsContent';
import { MATCH_BOTS_TYPES } from '../../../helpers/matchBotsHelpers';

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
        botTitle={intl.formatMessage({ id: 'matchBot_title_curators' })}
        turnOffTitle={intl.formatMessage({ id: 'matchBot_turn_off' })}
        turnOnTitle={intl.formatMessage({ id: 'matchBot_turn_on' })}
      />
      <MatchBotsCuratorsContent isEngLocale={isEngLocale} />
      <MatchBotsService
        botName="curators"
        isAuthority={isAuthority}
        botType={MATCH_BOTS_TYPES.CURATORS}
      />
      <ModalsCurators modalType="add" />
      {!!matchBots.length && <MatchBotsTable type="curator" botType={MATCH_BOTS_TYPES.CURATORS} />}
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
