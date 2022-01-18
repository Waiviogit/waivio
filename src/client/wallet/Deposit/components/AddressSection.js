import QRCode from 'qrcode.react';
import React from 'react';
import PropTypes from 'prop-types';
import CopyButton from '../../../widgets/CopyButton/CopyButton';

import '../Deposit.less';

const AddressSection = ({ address }) => (
  <div className={'Deposit__section'}>
    <h4>Address:</h4>
    <CopyButton className="Deposit__input" text={address} />
    <QRCode className="Deposit__qr-code" value={address} />
  </div>
);

AddressSection.propTypes = {
  address: PropTypes.string.isRequired,
};

export default AddressSection;
