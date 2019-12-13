import React from 'react';
import { Checkbox } from 'antd';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

const MatchBotTableRow = ({ intl, rule, handleEditRule }) => {
  const editRule = () => {
    handleEditRule(rule);
  };
  return (
    <React.Fragment>
      <tr>
        <td>
          <Checkbox checked={rule.enabled} />
        </td>
        <td>{rule.sponsor}</td>
        <td>{rule.voting_percent * 100}%</td>
        <td>
          <div className="MatchBotTable__edit" onClick={editRule} role="presentation">
            {intl.formatMessage({ id: 'matchBot_table_edit', defaultMessage: `Edit` })}
          </div>
        </td>
        <td>{rule.note}</td>
      </tr>
    </React.Fragment>
  );
};

MatchBotTableRow.propTypes = {
  intl: PropTypes.shape().isRequired,
  rule: PropTypes.shape(),
  handleEditRule: PropTypes.func.isRequired,
};

MatchBotTableRow.defaultProps = {
  rule: {},
};

export default injectIntl(MatchBotTableRow);
