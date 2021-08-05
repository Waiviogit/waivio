import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import MatchBotsTitle from '../MatchBotsTitle';
import getMatchBotMessageData from '../../MatchBotSponsors/matchBotMessageData';
import MatchBotsAuthorsContent from './MatchBotsAuthorsContent';

import '../MatchBots.less';

const MatchBotsAuthors = ({ intl }) => {
  const localizer = (id, defaultMessage) => intl.formatMessage({ id, defaultMessage });
  const messageData = getMatchBotMessageData(localizer);

  return (
    <div className="MatchBots">
      <MatchBotsTitle
        botTitle={messageData.titleBotsAuthors}
        turnOffTitle={messageData.turnOff}
        turnOnTitle={messageData.turnOn}
      />
      <MatchBotsAuthorsContent messageData={messageData} />
    </div>
  );
};

MatchBotsAuthors.propTypes = {
  intl: PropTypes.shape().isRequired,
};

export default injectIntl(MatchBotsAuthors);
