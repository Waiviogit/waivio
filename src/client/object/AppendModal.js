import React from 'react';
import { Modal } from 'antd';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import AppendForm from './AppendForm';

const AppendModal = ({ showModal, hideModal, locale, field }) => (
  <Modal
    title={null}
    footer={null}
    visible={showModal}
    onCancel={hideModal}
    width={767}
    destroyOnClose
  >
    <AppendForm hideModal={hideModal} currentLocale={locale} currentField={field} />
  </Modal>
);

AppendModal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  hideModal: PropTypes.func.isRequired,
  field: PropTypes.string,
  locale: PropTypes.string,
};

AppendModal.defaultProps = {
  showModal: false,
  field: 'auto',
  locale: 'en-US',
};

export default withRouter(AppendModal);
