import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import _ from 'lodash';
import MatchBotTableRow from './MatchBotTableRow';
import './MatchBotTable.less';

const MatchBotTable = ({
  handleEditRule,
  handleSwitcher,
  intl,
  isAuthority,
  rules,
  setIsEnabledRule,
  isNew,
}) => (
  <table className="MatchBotTable">
    <thead>
      <tr>
        <th className="MatchBotTable basicWidth">
          {intl.formatMessage({ id: 'matchBot_active', defaultMessage: 'Active' })}
        </th>
        <th className="MatchBotTable sponsorWidth">
          {intl.formatMessage({ id: 'matchBot_sponsor', defaultMessage: 'Sponsor' })}
        </th>
        <th className="MatchBotTable basicWidth">
          {intl.formatMessage({ id: 'matchBot_upvote', defaultMessage: 'Upvote' })}
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
      {_.map(rules, rule => (
        <MatchBotTableRow
          key={rule.sponsor}
          handleEditRule={handleEditRule}
          handleSwitcher={handleSwitcher}
          isAuthority={isAuthority}
          rule={rule}
          setIsEnabledRule={setIsEnabledRule}
          isNew={isNew}
        />
      ))}
    </tbody>
  </table>
);

MatchBotTable.propTypes = {
  handleEditRule: PropTypes.func.isRequired,
  handleSwitcher: PropTypes.func.isRequired,
  isAuthority: PropTypes.bool.isRequired,
  intl: PropTypes.shape().isRequired,
  rules: PropTypes.arrayOf(PropTypes.shape()),
  setIsEnabledRule: PropTypes.func.isRequired,
  isNew: PropTypes.bool,
};

MatchBotTable.defaultProps = {
  rules: [],
  isNew: false,
};

export default injectIntl(MatchBotTable);
