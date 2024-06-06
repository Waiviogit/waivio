import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router';
import { Button, Input, Modal } from 'antd';
import { isNil, isEmpty } from 'lodash';
import { Link } from 'react-router-dom';
import QRCode from 'qrcode.react';
import { encodeOp } from 'hive-uri';
import { useSelector } from 'react-redux';
import { cryptocurrenciesList } from '../../../../common/constants/listOfFields';
import { parseWobjectField } from '../../../../common/helpers/wObjectHelper';
import CopyButton from '../../../widgets/CopyButton/CopyButton';
import { getAuthenticatedUserName } from '../../../../store/authStore/authSelectors';
import { isMobile } from '../../../../common/helpers/apiHelpers';

const WalletAddressItem = ({ address }) => {
  const addressBody = parseWobjectField(address, 'body');
  const [qrCodeLink, setQRCodeLink] = useState(null);
  const [amount, setAmount] = useState(null);
  const username = addressBody.address;
  const [openModal, setOpenModal] = useState(false);
  const authUserName = useSelector(getAuthenticatedUserName);
  const history = useHistory();
  const uniqueQrCodeCurrencies = ['HIVE', 'HBD'].includes(addressBody.symbol);
  const disabledGenerate =
    isNil(amount) ||
    isEmpty(amount) ||
    parseFloat(amount) === 0 ||
    (uniqueQrCodeCurrencies && amount < 0.001);

  const onWalletAddressClick = () => {
    if (addressBody.symbol === 'WAIV') {
      history.push(`/@${addressBody.address}`);
    } else {
      setOpenModal(true);
    }
  };

  const cryptocurrency = cryptocurrenciesList.find(crypto => crypto.name === addressBody.symbol);

  const closeModal = () => {
    setOpenModal(false);
    setQRCodeLink(null);
    setAmount(null);
  };

  const generateQRCodeData = () => {
    const url = encodeOp([
      'transfer',
      { from: authUserName, to: username, amount: `${amount} ${addressBody.symbol}`, memo: '' },
    ]);

    setQRCodeLink(url);
  };

  return (
    <div className={'WalletAddressItem__container'}>
      <span className={'WalletAddressItem'} onClick={onWalletAddressClick}>
        <img
          className={'WalletAddressItem__icon'}
          src={`/images/icons/cryptocurrencies/${cryptocurrency.icon}`}
          alt={''}
        />
        {addressBody.title
          ? `${addressBody.title}`
          : `${cryptocurrency.shortName}: ${addressBody.address}`}
      </span>
      <Modal
        title={addressBody.symbol}
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
              Select the amount of {addressBody.symbol} you want to send to{' '}
              <Link to={`/@${username}`}>{username}</Link>
            </div>
            <Input
              value={amount}
              placeholder={'Enter amount'}
              type={'number'}
              onInput={e => setAmount(e.target.value)}
            />
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
            <div className="WalletAddressItem__title">Address:</div>
            <div className={'Deposit__section'}>
              <CopyButton className="WalletAddressItem__input" text={addressBody.address} />
              <div className="WalletAddressItem__qr-code-container">
                <QRCode className="Deposit__qr-code" value={addressBody.address} />
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

WalletAddressItem.propTypes = {
  address: PropTypes.shape().isRequired,
};
export default WalletAddressItem;
