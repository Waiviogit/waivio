import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import MatchBotsBtn from '../MatchBotsBtn';
import MatchBotsTitle from '../MatchBotsTitle';
import MatchBotsService from '../MatchBotsService';
import MatchBotsAuthorsContent from './MatchBotsAuthorsContent';
import getMatchBotMessageData from '../../MatchBotSponsors/matchBotMessageData';

import '../MatchBots.less';

const MatchBotsAuthors = ({ intl, isEngLocale }) => {
  const localizer = (id, defaultMessage) => intl.formatMessage({ id, defaultMessage });
  const messageData = getMatchBotMessageData(localizer);

  return (
    <div className="MatchBots">
      <MatchBotsTitle
        botTitle={messageData.titleBotsAuthors}
        turnOffTitle={messageData.turnOff}
        turnOnTitle={messageData.turnOn}
      />
      <MatchBotsAuthorsContent messageData={messageData} isEngLocale={isEngLocale} />
      <MatchBotsService messageData={messageData} botName="Authors" />
      <MatchBotsBtn name={messageData.matchBotsAuthorsBtnAdd} onClick={() => {}} />
    </div>
  );
};

MatchBotsAuthors.propTypes = {
  intl: PropTypes.shape().isRequired,
  isEngLocale: PropTypes.bool.isRequired,
};

export default injectIntl(MatchBotsAuthors);
