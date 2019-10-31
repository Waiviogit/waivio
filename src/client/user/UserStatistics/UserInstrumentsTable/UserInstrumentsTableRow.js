import React from 'react';
import PropTypes from 'prop-types';
import './UserInstrumentsTable.less';

const UserInstrumentsTableRow = ({ forecast }) => {
  return (
    <div className="UserInstrumentsTableRow">
      <div className="UserInstrumentsTableRow__instruments">{forecast.name}</div>
      <div className="UserInstrumentsTableRow__deals">{forecast.count}</div>
      <div className="UserInstrumentsTableRow__profit">{forecast.pips}</div>
    </div>
  );
};

UserInstrumentsTableRow.propTypes = {
  forecast: PropTypes.shape().isRequired,
};

export default UserInstrumentsTableRow;
