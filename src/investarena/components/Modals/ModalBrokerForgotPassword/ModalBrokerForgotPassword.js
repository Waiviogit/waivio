import React from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { injectIntl } from 'react-intl';
import ModalBrokerForgotPasswordBody from './ModalBrokerForgotPasswordBody';
import './ModalBrokerForgotPassword.less';

const ModalBrokerForgotPassword = ({toggle, isOpen, forgotPassBroker, isLoading, intl}) => (
        <Modal isOpen={isOpen} toggle={toggle} className="st-modal-broker-forgot-password-wrap">
            <ModalHeader toggle={toggle}>{intl.formatMessage({id: 'modalBrokerForgotPassword.headerTitle'})}</ModalHeader>
            <ModalBody>
                <ModalBrokerForgotPasswordBody isLoading={isLoading} forgotPassBroker={forgotPassBroker} toggle={toggle} isOpen={isOpen}/>
            </ModalBody>
        </Modal>
    );

export default injectIntl(ModalBrokerForgotPassword);
