import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import MatchBotsTitle from '../MatchBotsTitle';
import MatchBotsTable from '../MatchBotsTable';
import MatchBotsService from '../MatchBotsService';
import ModalsAuthors from '../MatchBotsModals/ModalsAuthors';
import MatchBotsAuthorsContent from './MatchBotsAuthorsContent';
import { MATCH_BOTS_NAMES, MATCH_BOTS_TYPES } from '../../../../common/helpers/matchBotsHelpers';

import '../MatchBots.less';

const MatchBotsAuthors = ({ intl, isEngLocale, matchBots, getMatchBots, clearMatchBots }) => {
  useEffect(() => {
    getMatchBots();

    return () => {
      clearMatchBots();
    };
  }, []);

  return (
    <div className="MatchBots">
      <MatchBotsTitle
        botType={MATCH_BOTS_TYPES.AUTHORS}
        botTitle={intl.formatMessage({
          id: 'matchBot_title_authors',
          defaultMessage: ' Authors match bot',
        })}
        turnOffTitle={intl.formatMessage({ id: 'matchBot_turn_off', defaultMessage: 'Turn off' })}
        turnOnTitle={intl.formatMessage({ id: 'matchBot_turn_on', defaultMessage: 'Turn on' })}
      />
      <MatchBotsAuthorsContent isEngLocale={isEngLocale} />
      <MatchBotsService botName={MATCH_BOTS_NAMES.AUTHORS} botType={MATCH_BOTS_TYPES.AUTHORS} />
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
  matchBots: PropTypes.arrayOf(PropTypes.shape()),
  getMatchBots: PropTypes.func,
  clearMatchBots: PropTypes.func,
};

MatchBotsAuthors.defaultProps = {
  matchBots: [],
};

export default injectIntl(MatchBotsAuthors);
