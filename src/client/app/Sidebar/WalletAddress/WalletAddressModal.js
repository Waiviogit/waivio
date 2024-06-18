import React, { useState } from 'react';
import { Button, Input, Modal } from 'antd';
import PropTypes from 'prop-types';
import { isEmpty, isNil } from 'lodash';
import { encodeOp } from 'hive-uri';
import { useSelector } from 'react-redux';
import QRCode from 'qrcode.react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import USDDisplay from '../../../components/Utils/USDDisplay';
import { isMobile } from '../../../../common/helpers/apiHelpers';
import CopyButton from '../../../widgets/CopyButton/CopyButton';
import { getAuthenticatedUserName } from '../../../../store/authStore/authSelectors';
import { getRatesList } from '../../../../store/ratesStore/ratesSelector';

const WalletAddressModal = ({
  username,
  symbol,
  cryptocurrency,
  address,
  openModal,
  setOpenModal,
}) => {
  const [qrCodeLink, setQRCodeLink] = useState(null);
  const [amount, setAmount] = useState(null);
  const authUserName = useSelector(getAuthenticatedUserName);
  const rates = useSelector(getRatesList);
  const uniqueQrCodeCurrencies = ['HIVE', 'HBD'].includes(symbol);
  const disabledGenerate =
    isNil(amount) ||
    isEmpty(amount) ||
    parseFloat(amount) === 0 ||
    (uniqueQrCodeCurrencies && amount < 0.001);

  const closeModal = () => {
    setOpenModal(false);
    setQRCodeLink(null);
    setAmount(null);
  };

  const generateQRCodeData = am => {
    const url = encodeOp([
      'transfer',
      { from: authUserName, to: username, amount: `${am} ${symbol}`, memo: '' },
    ]);

    setQRCodeLink(url);
  };
  const estimatedValue = val => {
    const currRate = cryptocurrency.shortName === 'HIVE' ? rates?.HIVE : rates?.HBD;

    return currRate * val;
  };

  return (
    openModal && (
      <Modal
        title={symbol}
        onCancel={closeModal}
        visible={openModal}
        footer={[
          <Button key="ok" type="primary" onClick={closeModal}>
            <FormattedMessage id="ok" defaultMessage="Ok" />
          </Button>,
        ]}
      >
        {uniqueQrCodeCurrencies ? (
          <div>
            <div className="WalletAddressItem__title">
              Select the amount of {symbol} you want to send to{' '}
              <Link to={`/@${username}`}>{username}</Link>
            </div>
            <Input
              value={amount}
              placeholder={'Enter amount'}
              type={'number'}
              onInput={e => {
                setAmount(e.target.value);
                generateQRCodeData(e.target.value);
              }}
            />
            <div className={'WalletItem__estimate'}>
              <FormattedMessage
                id="estimated_value"
                defaultMessage="Estimated transaction value: {estimate}"
                values={{
                  estimate: (
                    <span role="presentation" className="estimate">
                      <USDDisplay value={amount ? estimatedValue(amount) : 0} />
                    </span>
                  ),
                }}
              />
            </div>
            {!isNil(amount) &&
              !isNil(qrCodeLink) &&
              !disabledGenerate &&
              (isMobile() ? (
                <div className="WalletAddressItem__qr-code-container">
                  <a href={qrCodeLink}>
                    <QRCode size={200} className="Deposit__qr-code" value={qrCodeLink} />
                  </a>
                  <p>or</p>
                  <a href={qrCodeLink}>Click here</a>
                </div>
              ) : (
                <div className="WalletAddressItem__qr-code-container">
                  <QRCode size={200} className="Deposit__qr-code" value={qrCodeLink} />
                </div>
              ))}
          </div>
        ) : (
          <div>
            <div className="WalletAddressItem__title">Address:</div>
            <div className={'Deposit__section'}>
              <CopyButton className="WalletAddressItem__input" text={address} />
              <div className="WalletAddressItem__qr-code-container">
                <QRCode className="Deposit__qr-code" value={address} />
              </div>
            </div>
          </div>
        )}
      </Modal>
    )
  );
};

WalletAddressModal.propTypes = {
  cryptocurrency: PropTypes.shape().isRequired,
  address: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  symbol: PropTypes.string.isRequired,
  setOpenModal: PropTypes.func.isRequired,
  openModal: PropTypes.bool.isRequired,
};

export default WalletAddressModal;
