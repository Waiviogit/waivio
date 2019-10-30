import React from 'react';
import { Modal } from 'antd';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { withRouter } from 'react-router-dom';
import AppendForm from './AppendForm';

const AppendModal = ({ showModal, hideModal, chosenLocale, field, objName, intl }) => (
  <Modal
    title={`${intl.formatMessage({
      id: 'suggestion_add_field',
      defaultMessage: 'Update topic',
    })}: ${objName}`}
    footer={null}
    visible={showModal}
    onCancel={hideModal}
    maskClosable={false}
    width={767}
    destroyOnClose
  >
    <AppendForm
      chosenLocale={chosenLocale}
      currentField={field}
      hideModal={hideModal}
      intl={intl}
    />
  </Modal>
);

AppendModal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  hideModal: PropTypes.func.isRequired,
  field: PropTypes.string,
  chosenLocale: PropTypes.string,
  objName: PropTypes.string,
  intl: PropTypes.shape().isRequired,
};

AppendModal.defaultProps = {
  showModal: false,
  field: 'auto',
  chosenLocale: '',
  objName: '',
};

export default injectIntl(withRouter(AppendModal));
