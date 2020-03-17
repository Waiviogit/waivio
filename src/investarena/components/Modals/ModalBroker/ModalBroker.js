import { Modal } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import BrokerAuthorization from './BrokerAuthorization';
import './ModalBroker.less';

const propTypes = {
  authorizeBroker: PropTypes.func.isRequired,
  disconnectBroker: PropTypes.func.isRequired,
  toggleModal: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  platformName: PropTypes.string.isRequired,
};

const ModalBroker = props => (
  <Modal title={null} visible={props.isOpen} footer={null} onCancel={props.toggleModal} width={416} destroyOnClose>
    <BrokerAuthorization
      // platformName={props.platformName}
      // isLoading={props.isLoading}
      // authorizeBroker={props.authorizeBroker}
      disconnectBroker={props.disconnectBroker}
      toggleModal={props.toggleModal}
      // brokerConnected={props.platformName !== 'widgets'}
    />
  </Modal>
);

ModalBroker.propTypes = propTypes;

export default injectIntl(ModalBroker);
