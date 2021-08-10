import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import MatchBotsBtn from '../MatchBotsBtn';
import MatchBotsTitle from '../MatchBotsTitle';
import MatchBotsService from '../MatchBotsService';
import MatchBotsCuratorsContent from './MatchBotsCuratorsContent';
import getMatchBotMessageData from '../../MatchBotSponsors/matchBotMessageData';

import '../MatchBots.less';

const MatchBotsCurators = ({ intl, isEngLocale }) => {
  const localizer = (id, defaultMessage) => intl.formatMessage({ id, defaultMessage });
  const messageData = getMatchBotMessageData(localizer);

  return (
    <div className="MatchBots">
      <MatchBotsTitle
        botTitle={messageData.titleBotsCurators}
        turnOffTitle={messageData.turnOff}
        turnOnTitle={messageData.turnOn}
      />
      <MatchBotsCuratorsContent messageData={messageData} isEngLocale={isEngLocale} />
      <MatchBotsService messageData={messageData} botName="Curators" />
      <MatchBotsBtn name={messageData.matchBotsAuthorsBtnAdd} onClick={() => {}} />
    </div>
  );
};

MatchBotsCurators.propTypes = {
  intl: PropTypes.shape().isRequired,
  isEngLocale: PropTypes.bool.isRequired,
};

export default injectIntl(MatchBotsCurators);
