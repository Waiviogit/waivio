import { map } from 'lodash';
import * as React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import MatchBotsTableRow from './MatchBotsTableRow';
import ModalBotsEnableAuth from '../MatchBotsModals/ModalBotsEnableAuth';

const MatchBotsTable = ({
  intl,
  bots,
  type,
  botType,
  setIsEnabledRule,
  handleEditRule,
  handleSwitcher,
}) => {
  const [modalBot, setModalBot] = React.useState(null);

  return (
    <div>
      <ModalBotsEnableAuth
        type={type}
        botType={botType}
        modalBot={modalBot}
        setModalBot={setModalBot}
      />
      <table className="MatchBotTable">
        <thead>
          <tr>
            <th className="MatchBotTable basicWidth">
              {intl.formatMessage({ id: 'matchBot_active', defaultMessage: 'Active' })}
            </th>
            <th className="MatchBotTable sponsorWidth">
              {intl.formatMessage({ id: `matchBot_${type}` })}
            </th>
            {type === 'curator' && (
              <th className="MatchBotTable basicWidth">
                {intl.formatMessage({ id: 'matchBot_voteRatio', defaultMessage: 'Vote ratio' })}
              </th>
            )}
            {type === 'author' && (
              <th className="MatchBotTable basicWidth">
                {intl.formatMessage({ id: 'matchBot_upvote', defaultMessage: 'Upvote' })}
              </th>
            )}
            <th className="MatchBotTable basicWidth">
              {intl.formatMessage({ id: 'matchBot_MinVP', defaultMessage: 'Min VP' })}
            </th>
            <th className="MatchBotTable basicWidth">
              {intl.formatMessage({ id: 'matchBot_action', defaultMessage: 'Action' })}
            </th>
            <th className="MatchBotTable dateWidth">
              {intl.formatMessage({ id: 'matchBot_expiry_date', defaultMessage: 'Expiry date' })}
            </th>
            <th className="MatchBotTable notesWidth">
              {intl.formatMessage({ id: 'matchBot_notes', defaultMessage: 'Notes' })}
            </th>
          </tr>
        </thead>
        <tbody>
          {map(bots, bot => (
            <MatchBotsTableRow
              bot={bot}
              type={type}
              key={bot.sponsor}
              setModalBot={setModalBot}
              handleEditRule={handleEditRule}
              handleSwitcher={handleSwitcher}
              setIsEnabledRule={setIsEnabledRule}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

MatchBotsTable.propTypes = {
  intl: PropTypes.shape().isRequired,
  bots: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  type: PropTypes.string.isRequired,
  botType: PropTypes.string.isRequired,
  handleEditRule: PropTypes.func.isRequired,
  handleSwitcher: PropTypes.func.isRequired,
  setIsEnabledRule: PropTypes.func.isRequired,
};

MatchBotsTable.defaultProps = {
  handleEditRule: () => {},
  handleSwitcher: () => {},
  setIsEnabledRule: () => {},
};

export default injectIntl(MatchBotsTable);
