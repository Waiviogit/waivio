import { Checkbox } from 'antd';
import * as React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import { formatDate } from '../../../rewardsHelper';
import ModalsCurators from '../../MatchBotsModals/ModalsCurators';

const MatchBotsTableRow = ({
  intl,
  bot,
  type,
  editRule,
  isAuthority,
  handleChangeModalVisible,
  handleChangeAuthModalVisible,
}) => (
  <tr>
    <td>
      <Checkbox
        checked={bot.enabled}
        onChange={isAuthority ? handleChangeModalVisible : handleChangeAuthModalVisible}
      />
    </td>
    <td>{bot.name}</td>
    {type === 'curator' && <td>{Math.round(bot.voteRatio * 100)}%</td>}
    {type === 'author' && <td>{Math.round(bot.voteWeight / 100)}%</td>}
    <td>{Math.round(bot.minVotingPower / 100)}%</td>
    <td>
      <div className="MatchBotTable__edit" onClick={editRule} role="presentation">
        <ModalsCurators modalType="edit" bot={bot} />
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

MatchBotsTableRow.propTypes = {
  isAuthority: PropTypes.bool.isRequired,
  bot: PropTypes.shape().isRequired,
  type: PropTypes.oneOf(['curator, author']).isRequired,
  intl: PropTypes.shape().isRequired,
  editRule: PropTypes.func.isRequired,
  handleChangeModalVisible: PropTypes.func.isRequired,
  handleChangeAuthModalVisible: PropTypes.func.isRequired,
};

export default injectIntl(MatchBotsTableRow);
