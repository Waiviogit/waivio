import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import MatchBotsBtn from '../MatchBotsBtn';
import MatchBotsTitle from '../MatchBotsTitle';
import MatchBotsService from '../MatchBotsService';
import { MATCH_BOTS_TYPES } from '../../../helpers/matchBotsHelpers';
import MatchBotsAuthorsContent from './MatchBotsAuthorsContent';
import getMatchBotMessageData from '../../MatchBotSponsors/matchBotMessageData';

import '../MatchBots.less';

const MatchBotsAuthors = ({ intl, isEngLocale, isAuthority }) => {
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
      <MatchBotsBtn name={messageData.matchBotsAuthorsBtnAdd} onClick={() => {}} />
    </div>
  );
};

MatchBotsAuthors.propTypes = {
  intl: PropTypes.shape().isRequired,
  isEngLocale: PropTypes.bool.isRequired,
  isAuthority: PropTypes.bool.isRequired,
};

export default injectIntl(MatchBotsAuthors);
