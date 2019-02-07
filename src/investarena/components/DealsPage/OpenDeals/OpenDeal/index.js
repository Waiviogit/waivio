import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';
import { getPlatformNameState } from '../../../../redux/selectors/platformSelectors';
import { makeGetQuoteSettingsState } from '../../../../redux/selectors/quotesSettingsSelectors';
import { makeGetQuoteState } from '../../../../redux/selectors/quotesSelectors';
import OpenDeal from './OpenDeal';
// import { showNotification } from '../../../../../redux/actions/notificationActions';

const propTypes = {
  quote: PropTypes.object,
  quoteSettings: PropTypes.object,
  openDeal: PropTypes.object.isRequired,
  quoteSecurity: PropTypes.string.isRequired,
  dealPnL: PropTypes.string.isRequired,
  platformName: PropTypes.string.isRequired,
  viewMode: PropTypes.oneOf(['list', 'cards']),
};

const OpenDealContainer = props => <OpenDeal {...props} />;

OpenDealContainer.propTypes = propTypes;

const mapState = () => {
  const getQuoteState = makeGetQuoteState();
  const getQuoteSettingsState = makeGetQuoteSettingsState();
  return (state, ownProps) => {
    return {
      quote: getQuoteState(state, ownProps),
      quoteSettings: getQuoteSettingsState(state, ownProps),
      platformName: getPlatformNameState(state),
    };
  };
};

export default connect(mapState)(OpenDealContainer);
