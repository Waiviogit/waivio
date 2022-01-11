import { Input } from 'antd';
import QRCode from 'qrcode.react';
import React from 'react';
import PropTypes from 'prop-types';

import '../Deposit.less';

const AddressSection = ({ address }) => (
  <div className={'Deposit__section'}>
    <h4>Address</h4>
    <Input className={'Deposit__input'} value={address} />
    <QRCode className="Deposit__qr-code" value={address} />
  </div>
);

AddressSection.propTypes = {
  address: PropTypes.string.isRequired,
};

export default AddressSection;
