import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import './UserInstrumentsTable.less';
import UserInstrumentsTableHeader from './UserInstrumentsTableHeader';

const UserInstrumentsTable = ({ setSortOptions }) => {
  return (
    <div className="UserInstrumentsTable">
      <UserInstrumentsTableHeader sortOptions={setSortOptions} />
    </div>
  );
};

UserInstrumentsTable.propTypes = {
  statisticsData: PropTypes.func.isRequired,
};

export default injectIntl(UserInstrumentsTable);
