import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { map } from 'lodash';
import './UserInstrumentsTable.less';
import UserInstrumentsTableHeader from './UserInstrumentsTableHeader';
import UserInstrumentsTableRow from './UserInstrumentsTableRow';

const UserInstrumentsTable = ({ setSortOptions, forecasts }) => {
  return (
    <div className="UserInstrumentsTable">
      <UserInstrumentsTableHeader setSortOptions={setSortOptions} />
      {map(forecasts, forecast => (
        <UserInstrumentsTableRow forecast={forecast} />
      ))}
    </div>
  );
};

UserInstrumentsTable.propTypes = {
  setSortOptions: PropTypes.func.isRequired,
};

export default injectIntl(UserInstrumentsTable);
