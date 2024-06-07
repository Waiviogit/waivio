import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import QRCode from 'qrcode.react';
import CopyButton from '../widgets/CopyButton/CopyButton';
import './WalletItem.less';

const WalletItem = ({ wallet, profile }) => {
  const [openModal, setOpenModal] = useState(false);
  const address = profile[wallet.id];
  const onWalletAddressClick = () => {
    setOpenModal(true);
  };

  const closeModal = () => {
    setOpenModal(false);
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
        <div>
          <div className="WalletItem__title">Address:</div>
          <div className={'Deposit__section'}>
            <CopyButton className="WalletItem__input" text={address} />
            <div className="WalletItem__qr-code-container">
              <QRCode className="Deposit__qr-code" value={address} />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

WalletItem.propTypes = {
  wallet: PropTypes.shape().isRequired,
  profile: PropTypes.shape().isRequired,
};

export default WalletItem;
