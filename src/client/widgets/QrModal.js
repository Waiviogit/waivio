import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { message, Modal } from 'antd';
// import QrReader from 'react-qr-reader';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';

const QrModal = ({ visible, intl, setDataScan, handleClose }) => {
  // eslint-disable-next-line no-unused-vars
  const [result, setResult] = useState('');

  // const handleScan = data => {
  //   if ((!result && data) || (data && result && result !== data)) {
  //     setResult(data);
  //     message.success('Success!');
  //   }
  // };

  const handleAccept = () => {
    handleClose(false);
    setDataScan(result);
  };

  const handleCancel = () => {
    handleClose(false);
    setDataScan('');
  };

  const modalFooter = (
    <div key="scan-footer">
      <p className="Withdraw__title-footer">Scan Result</p>
      <div className="Withdraw__wrapper-footer">
        <span>{result}</span>
        <button className="Withdraw__button-footer" disabled={!result} onClick={handleAccept}>
          Accept
        </button>
      </div>
    </div>
  );

  return (
    <Modal
      visible={visible}
      title={intl.formatMessage({ id: 'qr_code_scanner', defaultMessage: 'QR code scanner' })}
      okText={intl.formatMessage({ id: 'withdraw_continue', defaultMessage: 'Request withdraw' })}
      cancelText={intl.formatMessage({ id: 'cancel', defaultMessage: 'Cancel' })}
      onOk={() => handleClose(false)}
      onCancel={handleCancel}
      footer={[modalFooter]}
    >
      {/* <QrReader */}
      {/*  delay={300} */}
      {/*  onError={e => { message.error(e); }} */}
      {/*  onScan={data => { handleScan(data); }} */}
      {/*  style={{ width: '100%' }} */}
      {/* /> */}
    </Modal>
  );
};

QrModal.propTypes = {
  intl: PropTypes.shape().isRequired,
  visible: PropTypes.bool.isRequired,
  setDataScan: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default injectIntl(QrModal);
