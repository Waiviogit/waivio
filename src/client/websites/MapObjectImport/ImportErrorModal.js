import React from 'react';
import { Button, Modal } from 'antd';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

const ImportErrorModal = ({
  closeImportModal,
  showImportModal,
  hasImportAuthority,
  hasVotingPower,
}) => (
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
    <>
      {!hasImportAuthority && (
        <p>
          {' '}
          There is no data import authorization. Please go to the Data Import page on Waivio and
          activate it.
        </p>
      )}
      {!hasImportAuthority && <br />}
      {!hasVotingPower && <p> Not enough voting power to perform the data import.</p>}
    </>
  </Modal>
);

ImportErrorModal.propTypes = {
  closeImportModal: PropTypes.func.isRequired,
  showImportModal: PropTypes.func.isRequired,
  hasImportAuthority: PropTypes.bool.isRequired,
  hasVotingPower: PropTypes.bool.isRequired,
};
export default ImportErrorModal;
