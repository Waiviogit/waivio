import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import './UserInstrumentsTable.less';

const UserInstrumentsTableRow = ({ forecast }) => {
  return <div>{forecast.pips}</div>;
};

UserInstrumentsTableRow.propTypes = {
  forecast: PropTypes.shape().isRequired,
};

export default injectIntl(UserInstrumentsTableRow);
