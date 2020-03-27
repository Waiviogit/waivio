import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PostQuotation from './PostQuotation';
import { toggleModal } from '../../redux/actions/modalsActions';
import { makeGetQuoteState } from '../../redux/selectors/quotesSelectors';
import { makeGetQuoteSettingsState } from '../../redux/selectors/quotesSettingsSelectors';
import { getPlatformNameState } from '../../redux/selectors/platformSelectors';
import { getIsAuthenticated } from '../../../client/reducers';

const PostQuotationContainer = props => <PostQuotation {...props} />;

PostQuotationContainer.propTypes = {
  /* passed props */
  caller: PropTypes.string.isRequired,
  quoteSecurity: PropTypes.string.isRequired,
  className: PropTypes.string,
};
PostQuotationContainer.defaultProps = {
  className: '',
};

function mapStateToProps() {
  const getQuoteState = makeGetQuoteState();
  const getQuoteSettingsState = makeGetQuoteSettingsState();
  return (state, ownProps) => ({
    quote: getQuoteState(state, ownProps),
    quoteSettings: getQuoteSettingsState(state, ownProps),
    platformName: getPlatformNameState(state),
    isAuthenticated: getIsAuthenticated(state),
  });
}

function mapDispatchToProps(dispatch) {
  return {
    toggleModal: (modalName, modalData = {}) => dispatch(toggleModal(modalName, modalData)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PostQuotationContainer);
