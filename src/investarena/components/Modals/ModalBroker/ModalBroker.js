import { Modal } from 'antd';
// import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';
import ModalBrokerTab from '../ModalBroker/ModalBrokerTab';
import './ModalBroker.less';

const propTypes = {
  forgotPassBroker: PropTypes.func.isRequired,
  registerBroker: PropTypes.func.isRequired,
  authorizeBroker: PropTypes.func.isRequired,
  disconnectBroker: PropTypes.func.isRequired,
  toggleModal: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  platformName: PropTypes.string.isRequired,
};

const ModalBroker = props => {
  return (
    <Modal
      title="Broker Settings"
      visible={props.isOpen}
      footer={null}
      onCancel={props.toggleModal}
      style={{ width: '451px' }}
    >
      <ModalBrokerTab
        isLoading={props.isLoading}
        platformName={props.platformName}
        forgotPassBroker={props.forgotPassBroker}
        registerBroker={props.registerBroker}
        authorizeBroker={props.authorizeBroker}
        disconnectBroker={props.disconnectBroker}
        toggleModal={props.toggleModal}
      />
    </Modal>
  );
};

ModalBroker.propTypes = propTypes;

export default ModalBroker;
