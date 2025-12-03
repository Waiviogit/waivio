import React from 'react';
import PropTypes from 'prop-types';
import useTemplateProvider from '../../../../designTemplates/TemplateProvider';
import './WalletAddress.less';

const WalletAddress = ({ walletAddress, isSocial }) => {
  const templateComponents = useTemplateProvider();
  const WalletAddressView = templateComponents?.WalletAddressView;

  if (!WalletAddressView) return null;

  return <WalletAddressView walletAddress={walletAddress} isSocial={isSocial} />;
};

WalletAddress.propTypes = {
  walletAddress: PropTypes.arrayOf(PropTypes.shape({})),
  isSocial: PropTypes.bool,
};

export default WalletAddress;
