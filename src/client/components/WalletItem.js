import React, { useState } from 'react';
import { Button, Input, Modal } from 'antd';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import QRCode from 'qrcode.react';
import { Link } from 'react-router-dom';
import { encodeOp } from 'hive-uri';
import { useSelector } from 'react-redux';
import { isEmpty, isNil } from 'lodash';
import CopyButton from '../widgets/CopyButton/CopyButton';
import { isMobile } from '../../common/helpers/apiHelpers';
import { getAuthenticatedUserName } from '../../store/authStore/authSelectors';
import USDDisplay from './Utils/USDDisplay';
import { getRatesList } from '../../store/ratesStore/ratesSelector';
import './WalletItem.less';

const WalletItem = ({ wallet, profile }) => {
  const [openModal, setOpenModal] = useState(false);
  const [amount, setAmount] = useState(null);
  const [qrCodeLink, setQRCodeLink] = useState(null);
  const address = profile[wallet.id];
  const authUserName = useSelector(getAuthenticatedUserName);
  const uniqueQrCodeCurrencies = ['HIVE', 'HBD'].includes(wallet.shortName);
  const rates = useSelector(getRatesList);
  const disabledGenerate =
    isNil(amount) ||
    isEmpty(amount) ||
    parseFloat(amount) === 0 ||
    (uniqueQrCodeCurrencies && amount < 0.001);

  const onWalletAddressClick = () => {
    setOpenModal(true);
  };

  const closeModal = () => {
    setOpenModal(false);
    setQRCodeLink(null);
    setAmount(null);
  };

  const generateQRCodeData = () => {
    const url = encodeOp([
      'transfer',
      { from: authUserName, to: address, amount: `${amount} ${wallet.shortName}`, memo: '' },
    ]);

    setQRCodeLink(url);
  };

  const estimatedValue = val => {
    const currRate = wallet.shortName === 'HIVE' ? rates?.HIVE : rates?.HBD;

    return currRate * val;
  };

  return (
    <div className={'WalletItem__container'}>
      <span className={'WalletItem'} onClick={onWalletAddressClick}>
        <img
          className={'WalletItem__icon'}
          src={`/images/icons/cryptocurrencies/${wallet.icon}`}
          alt={''}
        />
        {wallet.shortName}
      </span>
      <Modal
        title={wallet.name}
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
              Select the amount of {wallet.shortName} you want to send to{' '}
              <Link to={`/@${address}`}>{address}</Link>
            </div>
            <Input
              value={amount}
              placeholder={'Enter amount'}
              type={'number'}
              onInput={e => setAmount(e.target.value)}
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
            <div className="WalletAddressItem__generate-container">
              <Button type={'primary'} onClick={generateQRCodeData} disabled={disabledGenerate}>
                Generate QR code
              </Button>
            </div>
            {!isNil(amount) &&
              !isNil(qrCodeLink) &&
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
                  <QRCode className="Deposit__qr-code" value={qrCodeLink} />
                </div>
              ))}
          </div>
        ) : (
          <div>
            <div className="WalletItem__title">Address:</div>
            <div className={'Deposit__section'}>
              <CopyButton className="WalletItem__input" text={address} />
              <div className="WalletItem__qr-code-container">
                <QRCode className="Deposit__qr-code" value={address} />
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

WalletItem.propTypes = {
  wallet: PropTypes.shape().isRequired,
  profile: PropTypes.shape().isRequired,
};

export default WalletItem;
