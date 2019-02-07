// import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';
// import { getIsSignInState } from '../../redux/selectors/userSelectors';
import { makeGetQuoteSettingsState } from '../../redux/selectors/quotesSettingsSelectors';
import { makeGetQuoteState } from '../../redux/selectors/quotesSelectors';
import { toggleModal } from '../../redux/actions/modalsActions';
import PostSellBuy from './PostSellBuy';

const propTypes = {
  quoteSettings: PropTypes.object,
  quote: PropTypes.object,
  profitability: PropTypes.number,
  finalQuote: PropTypes.object,
  forecast: PropTypes.string.isRequired,
  isExpired: PropTypes.bool.isRequired,
  postPrice: PropTypes.string.isRequired,
  recommend: PropTypes.string.isRequired,
  isSignIn: PropTypes.bool.isRequired,
  goQuotePage: PropTypes.func.isRequired,
};

const PostSellBuyContainer = props => <PostSellBuy {...props} />;

PostSellBuyContainer.propTypes = propTypes;

const mapState = () => {
  const getQuoteState = makeGetQuoteState();
  const getQuoteSettingsState = makeGetQuoteSettingsState();
  return (state, ownProps) => {
    return {
      quote: getQuoteState(state, ownProps),
      quoteSettings: getQuoteSettingsState(state, ownProps),
      // isSignIn: getIsSignInState(state)
      isSignIn: false,
    };
  };
};

function mergeProps(stateProps, dispatchProps, ownProps) {
  const { isSignIn } = stateProps;
  const { dispatch } = dispatchProps;
  return {
    ...stateProps,
    ...ownProps,
    goQuotePage: quoteSecurity => {
      if (isSignIn) {
        // browserHistory.push(`/quote/${quoteSecurity}`);
      } else {
        dispatch(toggleModal('authorizeSinglePost'));
      }
    },
  };
}

export default connect(
  mapState,
  null,
  mergeProps,
)(PostSellBuyContainer);
