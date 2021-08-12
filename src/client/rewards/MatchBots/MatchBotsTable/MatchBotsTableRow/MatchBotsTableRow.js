import { Checkbox } from 'antd';
import * as React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import { formatDate } from '../../../rewardsHelper';
import ModalsAuthors from '../../MatchBotsModals/ModalsAuthors';

const MatchBotsTableRow = ({
  intl,
  bot,
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
    <td>{Math.round(bot.voteWeight / 100)}%</td>
    <td>{Math.round(bot.minVotingPower / 100)}%</td>
    <td>
      <div className="MatchBotTable__edit" onClick={editRule} role="presentation">
        {/* {intl.formatMessage({ id: 'edit', defaultMessage: 'Edit' })} */}
        <ModalsAuthors modalType="edit" bot={bot} />
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
  intl: PropTypes.shape().isRequired,
  editRule: PropTypes.func.isRequired,
  handleChangeModalVisible: PropTypes.func.isRequired,
  handleChangeAuthModalVisible: PropTypes.func.isRequired,
};

export default injectIntl(MatchBotsTableRow);
