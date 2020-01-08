import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import MatchBotTableRow from './MatchBotTableRow';
import './MatchBotTable.less';

const MatchBotTable = ({ handleEditRule, handleSwitcher, isAuthority, messageData, rules }) => (
  <table className="MatchBotTable">
    <thead>
      <tr>
        <th className="MatchBotTable basicWidth">{messageData.active}</th>
        <th className="MatchBotTable sponsorWidth">{messageData.sponsor}</th>
        <th className="MatchBotTable basicWidth">{messageData.upvote}</th>
        <th className="MatchBotTable basicWidth">{messageData.action}</th>
        <th className="MatchBotTable dateWidth">{messageData.expiryDate}</th>
        <th className="MatchBotTable notesWidth">{messageData.notes}</th>
      </tr>
    </thead>
    <tbody>
      {_.map(rules, rule => (
        <MatchBotTableRow
          // eslint-disable-next-line no-underscore-dangle
          key={rule._id}
          handleEditRule={handleEditRule}
          handleSwitcher={handleSwitcher}
          isAuthority={isAuthority}
          messageData={messageData}
          rule={rule}
        />
      ))}
    </tbody>
  </table>
);

MatchBotTable.propTypes = {
  handleEditRule: PropTypes.func.isRequired,
  handleSwitcher: PropTypes.func.isRequired,
  isAuthority: PropTypes.bool.isRequired,
  messageData: PropTypes.shape().isRequired,
  rules: PropTypes.arrayOf(PropTypes.shape()),
};

MatchBotTable.defaultProps = {
  rules: [],
};

export default MatchBotTable;
