import React from 'react';
import PropTypes from 'prop-types';
import './UserInstrumentsTable.less';
import { makeGetQuoteSettingsState } from '../../../../investarena/redux/selectors/quotesSettingsSelectors';
import { connect } from 'react-redux';

const UserInstrumentsTableRow = ({ forecast, quoteSettings }) => {
  console.log(quoteSettings);
  return (
    <div className="UserInstrumentsTableRow">
      <div className="UserInstrumentsTableRow__instruments">
        {quoteSettings ? quoteSettings.name : ''}
      </div>
      <div className="UserInstrumentsTableRow__deals">{forecast.count}</div>
      <div className="UserInstrumentsTableRow__profit">{forecast.pips}</div>
    </div>
  );
};

UserInstrumentsTableRow.propTypes = {
  forecast: PropTypes.shape().isRequired,
};

const mapState = () => {
  const getQuoteSettingsState = makeGetQuoteSettingsState();
  return (state, ownProps) => ({
    quoteSettings: getQuoteSettingsState(state, ownProps),
  });
};
export default connect(mapState)(UserInstrumentsTableRow);
