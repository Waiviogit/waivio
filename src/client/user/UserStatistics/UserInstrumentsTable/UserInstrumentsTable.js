import React from 'react';
import PropTypes from 'prop-types';
import { map } from 'lodash';
import UserInstrumentsTableHeader from './UserInstrumentsTableHeader';
import UserInstrumentsTableRow from './UserInstrumentsTableRow';
import './UserInstrumentsTable.less';

const UserInstrumentsTable = ({ setSortOptions, forecasts }) => (
    <div className="UserInstrumentsTable">
      <UserInstrumentsTableHeader setSortOptions={setSortOptions} />
      {map(forecasts, forecast => (
        <UserInstrumentsTableRow
          key={forecast.quote}
          forecast={forecast}
          quoteSecurity={forecast.quote}
        />
      ))}
    </div>
  );

UserInstrumentsTable.propTypes = {
  forecasts: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  setSortOptions: PropTypes.func.isRequired,
};

export default UserInstrumentsTable;
