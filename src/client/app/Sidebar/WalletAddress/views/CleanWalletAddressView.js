import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'antd';
import { useHistory } from 'react-router';
import { cryptocurrenciesList } from '../../../../../common/constants/listOfFields';
import { parseWobjectField } from '../../../../../common/helpers/wObjectHelper';
import WalletAddressModal from '../WalletAddressModal';

import '../WalletAddress.clean.less';

const WalletAddressItem = ({ address, history }) => {
  const [openModal, setOpenModal] = useState(false);
  const addressBody = parseWobjectField(address, 'body');
  const cryptocurrency = cryptocurrenciesList.find(crypto =>
    [crypto.abbreviation, crypto.name].includes(addressBody.symbol),
  );

  const onWalletAddressClick = () => {
    if (addressBody.symbol === 'WAIV') {
      history.push(`/@${addressBody.address}`);
    } else {
      setOpenModal(true);
    }
  };

  const tooltipTitle = addressBody.title
    ? `${addressBody.title}`
    : `${cryptocurrency.shortName}: ${addressBody.address}`;

  return (
    <React.Fragment>
      <Tooltip title={tooltipTitle} placement="top">
        <span className="WalletAddressClean__icon" onClick={onWalletAddressClick}>
          <img
            src={`/images/icons/cryptocurrencies/${cryptocurrency?.icon}`}
            alt={cryptocurrency ? cryptocurrency.shortName : ''}
          />
        </span>
      </Tooltip>
      <WalletAddressModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        symbol={addressBody.symbol}
        address={addressBody.address}
        username={addressBody.address}
        cryptocurrency={cryptocurrency}
      />
    </React.Fragment>
  );
};

WalletAddressItem.propTypes = {
  address: PropTypes.shape().isRequired,
  history: PropTypes.shape().isRequired,
};

const CleanWalletAddressView = ({ walletAddress }) => {
  const history = useHistory();

  return (
    <div className="WalletAddressClean">
      {walletAddress?.map(address => (
        <WalletAddressItem key={address._id} address={address} history={history} />
      ))}
    </div>
  );
};

CleanWalletAddressView.propTypes = {
  walletAddress: PropTypes.arrayOf(PropTypes.shape({})),
};

export default CleanWalletAddressView;
