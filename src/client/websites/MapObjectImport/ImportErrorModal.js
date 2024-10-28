import React from 'react';
import { Button, Modal } from 'antd';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

const ImportErrorModal = ({ closeImportModal, showImportModal, usersState }) => (
  <Modal
    onCancel={closeImportModal}
    footer={[
      <Button key="Ok" type="primary" onClick={closeImportModal}>
        <FormattedMessage id="ok" defaultMessage="Ok" />
      </Button>,
    ]}
    visible={showImportModal}
    title={'Data import for Nearby'}
  >
    <p className={'flex justify-center'}>{usersState?.message}</p>
  </Modal>
);

ImportErrorModal.propTypes = {
  closeImportModal: PropTypes.func.isRequired,
  showImportModal: PropTypes.func.isRequired,
  usersState: PropTypes.shape().isRequired,
};
export default ImportErrorModal;
