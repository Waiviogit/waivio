import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';
import {arrayOfLogos} from '../../constants/arrayOfQuoteLogos';
import './InstrumentAvatar.less';

const propTypes = {
    quoteSecurity: PropTypes.string.isRequired,
    market: PropTypes.string.isRequired
};
const avatarKey = {Currency: 'FX', Commodity: 'CM', Stock: 'ST', Crypto: 'CR', CryptoCurrency: 'CR', Index: 'IN'};

const InstrumentAvatar = ({ quoteSecurity, market }) => {
    const imageIdentifier = avatarKey[market] ? avatarKey[market] : avatarKey.Currency;
    return (
        <Link to={`/quote/${quoteSecurity}`}>
            <div className='st-instrument-avatar'>
                <img src={arrayOfLogos.includes(quoteSecurity)
                    ? `/images/investarena/logoQuotes/${quoteSecurity}.png`
                    : `/images/investarena/logoQuotes/${imageIdentifier}.png`}
                />
            </div>
        </Link>
    );
};

InstrumentAvatar.propTypes = propTypes;

export default InstrumentAvatar;
