import { connect } from 'react-redux';
import React from 'react';
import { makeGetQuoteSettingsState } from '../../../investarena/redux/selectors/quotesSettingsSelectors';
import { makeGetQuoteState } from '../../../investarena/redux/selectors/quotesSelectors';
import ForecastItem from './ForecastItem';

const ForecastItemContainer = props => <ForecastItem {...props} />;
const mapState = () => {
  const getQuoteState = makeGetQuoteState();
  const getQuoteSettingsState = makeGetQuoteSettingsState();
  return (state, ownProps) => ({
    quote: getQuoteState(state, ownProps),
    quoteSettings: getQuoteSettingsState(state, ownProps),
    isSignIn: false,
  });
};
export default connect(mapState)(ForecastItemContainer);
