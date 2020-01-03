import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import MatchBotTableRow from './MatchBotTableRow';
import './MatchBotTable.less';

const MatchBotTable = ({ intl, rules, handleEditRule, handleSwitcher, isAuthority }) => (
  <table className="MatchBotTable">
    <thead>
      <tr>
        <th className="MatchBotTable basicWidth">
          {intl.formatMessage({ id: 'active', defaultMessage: `Active` })}
        </th>
        <th className="MatchBotTable sponsorWidth">
          {intl.formatMessage({ id: 'sponsor', defaultMessage: `Sponsor` })}
        </th>
        <th className="MatchBotTable basicWidth">
          {intl.formatMessage({ id: 'upvote', defaultMessage: `Upvote` })}
        </th>
        <th className="MatchBotTable basicWidth">
          {intl.formatMessage({ id: 'action', defaultMessage: `Action` })}
        </th>
        <th className="MatchBotTable dateWidth">Expiry date</th>
        <th className="MatchBotTable notesWidth">
          {intl.formatMessage({ id: 'notes', defaultMessage: `Notes` })}
        </th>
      </tr>
    </thead>
    <tbody>
      {_.map(rules, rule => (
        <MatchBotTableRow
          // eslint-disable-next-line no-underscore-dangle
          key={rule._id}
          rule={rule}
          handleEditRule={handleEditRule}
          handleSwitcher={handleSwitcher}
          isAuthority={isAuthority}
        />
      ))}
    </tbody>
  </table>
);

MatchBotTable.propTypes = {
  intl: PropTypes.shape().isRequired,
  rules: PropTypes.arrayOf(PropTypes.shape()),
  handleEditRule: PropTypes.func.isRequired,
  handleSwitcher: PropTypes.func.isRequired,
  isAuthority: PropTypes.bool.isRequired,
};

MatchBotTable.defaultProps = {
  rules: [],
};

export default MatchBotTable;
