import { Checkbox } from 'antd';
import * as React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import { formatDate } from '../../../rewardsHelper';
import ModalsCurators from '../../MatchBotsModals/ModalsCurators';
import ModalsAuthors from '../../MatchBotsModals/ModalsAuthors';

const MatchBotsTableRow = ({ intl, bot, type, editRule, setModalBot }) => {
  const toggleEnableBot = () => setModalBot(bot);

  return (
    <tr>
      <td>
        <Checkbox checked={bot.enabled} onChange={toggleEnableBot} />
      </td>
      <td>{bot.name}</td>
      {type === 'curator' && <td>{Math.round(bot.voteRatio * 100)}%</td>}
      {type === 'author' && <td>{Math.round(bot.voteWeight / 100)}%</td>}
      <td>{Math.round(bot.minVotingPower / 100)}%</td>
      <td>
        <div className="MatchBotTable__edit" onClick={editRule} role="presentation">
          {type === 'curator' && <ModalsCurators modalType="edit" bot={bot} />}
          {type === 'author' && <ModalsAuthors modalType="edit" bot={bot} />}
        </div>
      </td>
      <td>
        {bot.expiredAt
          ? formatDate(intl, bot.expiredAt)
          : intl.formatMessage({ id: 'matchBot_termless', defaultMessage: 'Termless' })}
      </td>
      <td>{bot.note}</td>
    </tr>
  );
};

MatchBotsTableRow.propTypes = {
  bot: PropTypes.shape().isRequired,
  intl: PropTypes.shape().isRequired,
  editRule: PropTypes.func.isRequired,
  setModalBot: PropTypes.func.isRequired,
  type: PropTypes.oneOf(['curator, author']).isRequired,
};

export default injectIntl(MatchBotsTableRow);
