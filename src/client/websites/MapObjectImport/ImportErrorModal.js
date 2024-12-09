import React from 'react';
import { Button, Modal } from 'antd';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

const errorMessages = {
  notEnoughPower: {
    trigger: 'Not enough vote power',
    message:
      'A minimum of $10 worth of WAIV Power is required to perform data import. Please power up some WAIV to continue.',
  },
  noAuthorization: {
    trigger:
      'There is no data import authorization. Please go to the Data Import page and activate it.',
    message:
      'Please authorize the Data Import bot to post object updates on the Hive blockchain. You can include the Authorize button here for convenience. The Ok button can be replaced with Cancel.',
  },
};

const ImportErrorModal = ({ closeImportModal, showImportModal, usersState }) => {
  const errorKey = Object.keys(errorMessages).find(
    key => usersState?.message === errorMessages[key].trigger,
  );

  const mess = errorKey ? errorMessages[errorKey].message : usersState?.message;

  return (
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
      <p className={'flex justify-center'}>{mess}</p>
    </Modal>
  );
};

ImportErrorModal.propTypes = {
  closeImportModal: PropTypes.func.isRequired,
  showImportModal: PropTypes.func.isRequired,
  usersState: PropTypes.shape().isRequired,
};
export default ImportErrorModal;
