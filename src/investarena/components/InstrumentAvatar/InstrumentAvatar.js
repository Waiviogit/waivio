import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';
import './InstrumentAvatar.less';

const propTypes = {
  permlink: PropTypes.string.isRequired,
  market: PropTypes.string.isRequired,
  avatarlink: PropTypes.string,
};
const avatarKey = {
  Currency: 'FX',
  Commodity: 'CM',
  Stock: 'ST',
  Crypto: 'CR',
  Index: 'IN',
};

const InstrumentAvatar = ({ permlink, market, avatarlink }) => {
  const imageIdentifier = avatarKey[market] ? avatarKey[market] : avatarKey.Currency;
  return (
    <Link to={`/object/${permlink}`}>
      <div className="st-instrument-avatar">
        <img
          alt="avatar"
          src={avatarlink || `/images/investarena/logoQuotes/${imageIdentifier}.png`}
        />
      </div>
    </Link>
  );
};

InstrumentAvatar.propTypes = propTypes;

export default InstrumentAvatar;
