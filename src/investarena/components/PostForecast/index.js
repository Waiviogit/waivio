import { connect } from 'react-redux';
import React from 'react';
import { makeGetQuoteSettingsState } from '../../redux/selectors/quotesSettingsSelectors';
import { makeGetQuoteState } from '../../redux/selectors/quotesSelectors';
import PostForecast from "./PostForecast";

const PostForecastContainer = props => <PostForecast {...props} />;

const mapState = () => {
  const getQuoteState = makeGetQuoteState();
  const getQuoteSettingsState = makeGetQuoteSettingsState();
  return (state, ownProps) => ({
    quote: getQuoteState(state, ownProps),
    quoteSettings: getQuoteSettingsState(state, ownProps),
    isSignIn: false,
  });
};

export default connect(mapState)(PostForecastContainer);
