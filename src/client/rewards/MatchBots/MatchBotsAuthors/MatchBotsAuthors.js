import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import MatchBotsTitle from '../MatchBotsTitle';
import MatchBotsTable from '../MatchBotsTable';
import MatchBotsService from '../MatchBotsService';
import ModalsAuthors from '../MatchBotsModals/ModalsAuthors';
import MatchBotsAuthorsContent from './MatchBotsAuthorsContent';
import { MATCH_BOTS_TYPES } from '../../../helpers/matchBotsHelpers';
import getMatchBotMessageData from '../../MatchBotSponsors/matchBotMessageData';

import '../MatchBots.less';

const MatchBotsAuthors = ({ intl, isEngLocale, isAuthority, getMatchBots, matchBots }) => {
  React.useEffect(() => {
    if (isAuthority) getMatchBots();
  }, [isAuthority]);
  const localizer = (id, defaultMessage) => intl.formatMessage({ id, defaultMessage });
  const messageData = getMatchBotMessageData(localizer);

  return (
    <div className="MatchBots">
      <MatchBotsTitle
        botType={MATCH_BOTS_TYPES.AUTHORS}
        botTitle={messageData.titleBotsAuthors}
        turnOffTitle={messageData.turnOff}
        turnOnTitle={messageData.turnOn}
      />
      <MatchBotsAuthorsContent messageData={messageData} isEngLocale={isEngLocale} />
      <MatchBotsService
        botName="Authors"
        messageData={messageData}
        isAuthority={isAuthority}
        botType={MATCH_BOTS_TYPES.AUTHORS}
      />
      <ModalsAuthors modalType="add" />
      {matchBots.length && <MatchBotsTable type="author" botType={MATCH_BOTS_TYPES.AUTHORS} />}
    </div>
  );
};

MatchBotsAuthors.propTypes = {
  intl: PropTypes.shape().isRequired,
  isEngLocale: PropTypes.bool.isRequired,
  isAuthority: PropTypes.bool.isRequired,
  getMatchBots: PropTypes.func.isRequired,
  matchBots: PropTypes.arrayOf(PropTypes.shape()),
};

MatchBotsAuthors.defaultProps = {
  matchBots: [],
};

export default injectIntl(MatchBotsAuthors);
