import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React from 'react';
import { getPlatformNameState } from '../../redux/selectors/platformSelectors';
import DealsPage from './DealsPage';
import { toggleModal } from '../../redux/actions/modalsActions';
import {getScreenSize} from "../../../client/reducers";

const propTypes = {
    platformName: PropTypes.string.isRequired,
    toggleModalBroker: PropTypes.func.isRequired
};

const DealsPageContainer = (props) => <DealsPage {...props} />;

DealsPageContainer.propTypes = propTypes;

function mapStateToProps (state) {
    return {
        platformName: getPlatformNameState(state),
        screenSize: getScreenSize(state)
    };
}

function mapDispatchToProps (dispatch) {
  return ({
    toggleModalBroker: () => { dispatch(toggleModal('broker')) }
  });
}

export default connect(mapStateToProps, mapDispatchToProps)(DealsPageContainer);
