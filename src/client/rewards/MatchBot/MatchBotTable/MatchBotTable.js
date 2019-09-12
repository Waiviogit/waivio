import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import MatchBotTableRow from './MatchBotTableRow';
import './MatchBotTable.less';

const MatchBotTable = ({ intl, sponsors }) => (
  <table className="MatchBotTable">
    <thead>
      <tr>
        <th className="MatchBotTable basicWidth">
          {intl.formatMessage({ id: 'active', defaultMessage: `Active` })}
        </th>
        <th className="MatchBotTable mediumWidth">
          {intl.formatMessage({ id: 'sponsor', defaultMessage: `Sponsor` })}
        </th>
        <th className="MatchBotTable basicWidth">
          {intl.formatMessage({ id: 'upvote', defaultMessage: `Upvote` })}
        </th>
        <th className="MatchBotTable basicWidth">
          {intl.formatMessage({ id: 'action', defaultMessage: `Action` })}
        </th>
        <th className="MatchBotTable maxWidth">
          {intl.formatMessage({ id: 'notes', defaultMessage: `Notes` })}
        </th>
      </tr>
    </thead>
    <tbody>
      {_.map(sponsors, sponsor => (
        <MatchBotTableRow key={sponsor.id} sponsor={sponsor} />
      ))}
    </tbody>
  </table>
);

MatchBotTable.propTypes = {
  intl: PropTypes.shape().isRequired,
  sponsors: PropTypes.arrayOf(PropTypes.shape()),
};

MatchBotTable.defaultProps = {
  sponsors: [],
};

export default MatchBotTable;
