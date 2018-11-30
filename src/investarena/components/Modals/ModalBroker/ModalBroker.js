import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';
import ModalBrokerTab from '../ModalBroker/ModalBrokerTab';
import './ModalBroker.less';

const propTypes = {
    getBroker: PropTypes.func.isRequired,
    forgotPassBroker: PropTypes.func.isRequired,
    getBrokers: PropTypes.func.isRequired,
    registerBroker: PropTypes.func.isRequired,
    authorizeBroker: PropTypes.func.isRequired,
    disconnectBroker: PropTypes.func.isRequired,
    toggleModal: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    platformName: PropTypes.string.isRequired
};

const ModalBroker = (props) => {
    return (
        <Modal isOpen={props.isOpen} toggle={props.toggleModal} className="modal-broker">
            <ModalHeader toggle={props.toggleModal}><FormattedMessage id="modalBroker.header.title" /></ModalHeader>
            <ModalBody>
                <ModalBrokerTab
                    isLoading={props.isLoading}
                    platformName={props.platformName}
                    getBroker={props.getBroker}
                    forgotPassBroker={props.forgotPassBroker}
                    getBrokers={props.getBrokers}
                    registerBroker={props.registerBroker}
                    authorizeBroker={props.authorizeBroker}
                    disconnectBroker={props.disconnectBroker}
                    toggleModal={props.toggleModal}
                />
            </ModalBody>
        </Modal>
    );
};

ModalBroker.propTypes = propTypes;

export default ModalBroker;
