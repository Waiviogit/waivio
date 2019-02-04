import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React from 'react';
import { getIsConnectPlatformState, getPlatformNameState } from '../../redux/selectors/platformSelectors';
import DealsPage from './DealsPage';
import { getQuotesSettingsState } from '../../redux/selectors/quotesSettingsSelectors';
import { getQuotesState } from '../../redux/selectors/quotesSelectors';
import { toggleModal } from '../../redux/actions/modalsActions';

const propTypes = {
    platformName: PropTypes.string.isRequired,
    toggleModalBroker: PropTypes.func.isRequired
};

const DealsPageContainer = (props) => <DealsPage {...props} />;

DealsPageContainer.propTypes = propTypes;

function mapStateToProps (state) {
    return {
        platformName: getPlatformNameState(state),
    };
}

function mapDispatchToProps (dispatch) {
  return ({
    toggleModalBroker: () => { dispatch(toggleModal('broker')) }
  });
}

export default connect(mapStateToProps, mapDispatchToProps)(DealsPageContainer);
