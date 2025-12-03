import React from 'react';
import PropTypes from 'prop-types';
import WalletAddressItem from '../WalletAddressItem';

const ClassicWalletAddressView = ({ walletAddress, isSocial }) => (
  <div className="WalletAddress">
    {walletAddress?.map(address => (
      <WalletAddressItem key={address._id} address={address} isSocial={isSocial} />
    ))}
  </div>
);

ClassicWalletAddressView.propTypes = {
  walletAddress: PropTypes.arrayOf(PropTypes.shape({})),
  isSocial: PropTypes.bool,
};

export default ClassicWalletAddressView;
