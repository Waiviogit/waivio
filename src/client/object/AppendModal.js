import React from 'react';
import { Modal } from 'antd';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { withRouter } from 'react-router-dom';
import AppendForm from './AppendForm';

const AppendModal = ({ showModal, hideModal, locale, field, objName, objType, intl }) => (
  <Modal
    title={`${intl.formatMessage({
      id: 'suggestion_add_field',
      defaultMessage: 'Update',
    })}: ${objName}`}
    footer={null}
    visible={showModal}
    onCancel={hideModal}
    width={767}
    destroyOnClose
  >
    <AppendForm
      objType={objType}
      hideModal={hideModal}
      currentLocale={locale}
      currentField={field}
    />
  </Modal>
);

AppendModal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  hideModal: PropTypes.func.isRequired,
  field: PropTypes.string,
  locale: PropTypes.string,
  objName: PropTypes.string,
  objType: PropTypes.string,
  intl: PropTypes.shape().isRequired,
};

AppendModal.defaultProps = {
  showModal: false,
  field: 'auto',
  locale: 'en-US',
  objName: '',
  objType: 'item',
};

export default injectIntl(withRouter(AppendModal));
