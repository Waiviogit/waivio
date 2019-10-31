import React from 'react';
import PropTypes from 'prop-types';
import { map } from 'lodash';
import './UserInstrumentsTable.less';
import UserInstrumentsTableHeader from './UserInstrumentsTableHeader';
import UserInstrumentsTableRow from './UserInstrumentsTableRow';

const UserInstrumentsTable = ({ setSortOptions, forecasts }) => {
  return (
    <div className="UserInstrumentsTable">
      <UserInstrumentsTableHeader setSortOptions={setSortOptions} />
      {map(forecasts, forecast => (
        <UserInstrumentsTableRow forecast={forecast} quoteSecurity={forecast.quote} />
      ))}
    </div>
  );
};

UserInstrumentsTable.propTypes = {
  setSortOptions: PropTypes.func.isRequired,
};

export default UserInstrumentsTable;
