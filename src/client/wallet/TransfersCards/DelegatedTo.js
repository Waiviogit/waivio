import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { isInteger } from 'lodash';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import Avatar from '../../components/Avatar';
import CardsTimeStamp from './CardsTimeStamp';
import '../UserWalletTransactions/UserWalletTransactions.less';

const DelegatedTo = ({ timestamp, quantity, symbol, to, from, account }) => {
  const isReceive = account === to;
  const link = isReceive ? from : to;
  const minimumFractionDigits = isInteger(Number(quantity)) ? 0 : 3;
  const amountClassList = classNames(
    'UserWalletTransactions__marginLeft UserWalletTransactions__amount--black',
  );
  const point = isReceive ? '+' : '-';

  return (
    <div className="UserWalletTransactions__transaction">
      <Avatar size={40} username={isReceive ? from : to} />
      <div className="UserWalletTransactions__content">
        <div className="UserWalletTransactions__content-recipient">
          <p>
            {isReceive ? (
              <FormattedMessage id="delegation_from" defaultMessage="Delegation from" />
            ) : (
              <FormattedMessage id="delegated_to" defaultMessage="Delegated to" />
            )}
            <span className="UserWalletTransactions__delegated">
              <a className="UserWalletTransactions__delegated-color" href={`/@${link}`}>
                {link}
              </a>
            </span>
          </p>
          {!!quantity && (
            <span className={amountClassList}>
              {point}{' '}
              <FormattedNumber
                value={quantity}
                locale={'en-IN'}
                minimumFractionDigits={minimumFractionDigits}
                maximumFractionDigits={3}
              />{' '}
              {symbol}
            </span>
          )}
        </div>
        <CardsTimeStamp timestamp={timestamp} />
      </div>
    </div>
  );
};

DelegatedTo.propTypes = {
  timestamp: PropTypes.number.isRequired,
  quantity: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  account: PropTypes.string.isRequired,
  from: PropTypes.string.isRequired,
  symbol: PropTypes.string.isRequired,
};

export default DelegatedTo;
