import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router';
import { cryptocurrenciesList } from '../../../../common/constants/listOfFields';
import { parseWobjectField } from '../../../../common/helpers/wObjectHelper';
import WalletAddressModal from './WalletAddressModal';

const WalletAddressItem = ({ address, isSocial }) => {
  const addressBody = parseWobjectField(address, 'body');
  const username = addressBody.address;
  const [openModal, setOpenModal] = useState(false);
  const history = useHistory();

  const onWalletAddressClick = () => {
    if (addressBody.symbol === 'WAIV') {
      history.push(`/@${addressBody.address}`);
    } else {
      setOpenModal(true);
    }
  };

  const cryptocurrency = cryptocurrenciesList.find(crypto =>
    [crypto.abbreviation, crypto.name].includes(addressBody.symbol),
  );

  return (
    <div className={'WalletAddressItem__container'}>
      <span className={'WalletAddressItem'} onClick={onWalletAddressClick}>
        <img
          className={isSocial ? 'WalletAddressItem__icon--social' : 'WalletAddressItem__icon'}
          src={`/images/icons/cryptocurrencies/${cryptocurrency?.icon}`}
          alt={''}
        />
        {addressBody.title
          ? `${addressBody.title}`
          : `${cryptocurrency.shortName}: ${addressBody.address}`}
      </span>
      <WalletAddressModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        symbol={addressBody.symbol}
        address={addressBody.address}
        username={username}
        cryptocurrency={cryptocurrency}
      />
    </div>
  );
};

WalletAddressItem.propTypes = {
  address: PropTypes.shape().isRequired,
  isSocial: PropTypes.bool,
};
export default WalletAddressItem;
