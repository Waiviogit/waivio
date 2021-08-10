import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import MatchBotsBtn from '../MatchBotsBtn';
import MatchBotsTitle from '../MatchBotsTitle';
import MatchBotsService from '../MatchBotsService';
import MatchBotsCuratorsContent from './MatchBotsCuratorsContent';
import { MATCH_BOTS_TYPES } from '../../../helpers/matchBotsHelpers';
import getMatchBotMessageData from '../../MatchBotSponsors/matchBotMessageData';

import '../MatchBots.less';

const MatchBotsCurators = ({ intl, isEngLocale, isAuthority }) => {
  const localizer = (id, defaultMessage) => intl.formatMessage({ id, defaultMessage });
  const messageData = getMatchBotMessageData(localizer);

  return (
    <div className="MatchBots">
      <MatchBotsTitle
        botType={MATCH_BOTS_TYPES.CURATORS}
        botTitle={messageData.titleBotsCurators}
        turnOffTitle={messageData.turnOff}
        turnOnTitle={messageData.turnOn}
      />
      <MatchBotsCuratorsContent messageData={messageData} isEngLocale={isEngLocale} />
      <MatchBotsService
        botName="Curators"
        messageData={messageData}
        isAuthority={isAuthority}
        botType={MATCH_BOTS_TYPES.CURATORS}
      />
      <MatchBotsBtn name={messageData.matchBotsAuthorsBtnAdd} onClick={() => {}} />
    </div>
  );
};

MatchBotsCurators.propTypes = {
  intl: PropTypes.shape().isRequired,
  isEngLocale: PropTypes.bool.isRequired,
  isAuthority: PropTypes.bool.isRequired,
};

export default injectIntl(MatchBotsCurators);
