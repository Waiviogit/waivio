import React from 'react';
import { Checkbox } from 'antd';
import PropTypes from 'prop-types';

const MatchBotTableRow = ({ sponsor }) => (
  <React.Fragment>
    <tr>
      <td>
        <Checkbox checked={sponsor.isActive} />
      </td>
      <td>{sponsor.name}</td>
      <td>{sponsor.upvote}%</td>
      <td>{sponsor.action}</td>
      <td>{sponsor.notes}</td>
    </tr>
  </React.Fragment>
);

MatchBotTableRow.propTypes = {
  sponsor: PropTypes.shape(),
};

MatchBotTableRow.defaultProps = {
  sponsor: {},
};

export default MatchBotTableRow;
