import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';
import './WalletItem.less';
import WalletAddressModal from '../app/Sidebar/WalletAddress/WalletAddressModal';

const WalletItem = ({ wallet, profile }) => {
  const [openModal, setOpenModal] = useState(false);
  const params = useParams();
  const uniqueQrCodeCurrencies = ['HIVE', 'HBD'].includes(wallet.shortName);
  const address = uniqueQrCodeCurrencies ? params?.name : profile[wallet.id];

  const onWalletAddressClick = () => {
    setOpenModal(true);
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
      <WalletAddressModal
        address={address}
        setOpenModal={setOpenModal}
        username={address}
        openModal={openModal}
        symbol={wallet.shortName}
        cryptocurrency={wallet}
      />
    </div>
  );
};

WalletItem.propTypes = {
  wallet: PropTypes.shape().isRequired,
  profile: PropTypes.shape().isRequired,
};

export default WalletItem;
