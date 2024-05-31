import React from 'react';
import PropTypes from 'prop-types';
import WalletAddressItem from './WalletAddressItem';
import './WalletAddress.less';

const WalletAddress = ({ walletAddress }) => (
  <div className={'WalletAddress'}>
    {walletAddress.map(address => (
      <WalletAddressItem key={address._id} address={address} />
    ))}
  </div>
);

WalletAddress.propTypes = {
  walletAddress: PropTypes.arrayOf(),
};

export default WalletAddress;
