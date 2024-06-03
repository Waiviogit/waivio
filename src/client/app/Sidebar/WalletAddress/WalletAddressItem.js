import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Button, Modal } from 'antd';
import QRCode from 'qrcode.react';
import { cryptocurrenciesList } from '../../../../common/constants/listOfFields';
import { parseWobjectField } from '../../../../common/helpers/wObjectHelper';
import CopyButton from '../../../widgets/CopyButton/CopyButton';

const WalletAddressItem = ({ address }) => {
  const addressBody = parseWobjectField(address, 'body');
  const [openModal, setOpenModal] = useState(false);
  const history = useHistory();
  const onWalletAddressClick = () => {
    if (addressBody.symbol === 'HIVE') {
      history.push(`/@${addressBody.address}`);
    } else {
      setOpenModal(true);
    }
  };

  const cryptocurrency = cryptocurrenciesList.find(crypto => crypto.name === addressBody.symbol);

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
        onCancel={() => setOpenModal(false)}
        visible={openModal}
        footer={[
          <Button key="ok" type="primary" onClick={() => setOpenModal(false)}>
            <FormattedMessage id="ok" defaultMessage="Ok" />
          </Button>,
        ]}
      >
        <div className="WalletAddressItem__title">Address:</div>

        <div className={'Deposit__section'}>
          <CopyButton className="WalletAddressItem__input" text={addressBody.address} />
          <div className="WalletAddressItem__qr-code-container">
            <QRCode className="Deposit__qr-code" value={addressBody.address} />
          </div>
        </div>
      </Modal>
    </div>
  );
};

WalletAddressItem.propTypes = {
  address: PropTypes.shape().isRequired,
};
export default WalletAddressItem;
