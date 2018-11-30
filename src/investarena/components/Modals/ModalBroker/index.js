import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React from 'react';
import { authorizeBroker, getBroker,
getBrokers, disconnectBroker,
registerBroker, forgotPassBroker } from '../../../redux/actions/brokersActions';
import { getPlatformNameState,
getIsLoadingPlatformState
} from '../../../redux/selectors/platformSelectors';
import { getModalIsOpenState } from '../../../redux/selectors/modalsSelectors';
import ModalBroker from './ModalBroker';
import { toggleModal } from '../../../redux/actions/modalsActions';

const propTypes = {
    getBroker: PropTypes.func.isRequired,
    getBrokers: PropTypes.func.isRequired,
    forgotPassBroker: PropTypes.func.isRequired,
    registerBroker: PropTypes.func.isRequired,
    authorizeBroker: PropTypes.func.isRequired,
    disconnectBroker: PropTypes.func.isRequired,
    toggleModal: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    platformName: PropTypes.string.isRequired
};

const ModalBrokerContainer = (props) => <ModalBroker {...props}/>;

ModalBrokerContainer.propTypes = propTypes;

function mapStateToProps (state) {
    return {
        isOpen: getModalIsOpenState(state, 'broker'),
        isLoading: getIsLoadingPlatformState(state),
        platformName: getPlatformNameState(state)
    };
}

function mergeProps (stateProps, dispatchProps) {
    const { platformName, isOpen, isLoading} = stateProps;
    const { dispatch } = dispatchProps;
    return {
        platformName,
        isLoading,
        isOpen,
        forgotPassBroker: (data) => dispatch(forgotPassBroker(data)),
        getBroker: () => dispatch(getBroker()),
        getBrokers: () => dispatch(getBrokers()),
        registerBroker: (registrationData, authorizationData) => dispatch(registerBroker(registrationData, authorizationData)),
        authorizeBroker: (data) => dispatch(authorizeBroker(data)),
        disconnectBroker: () => dispatch(disconnectBroker()),
        toggleModal: () => dispatch(toggleModal('broker'))
    };
}

export default connect(mapStateToProps, null, mergeProps)(ModalBrokerContainer);
