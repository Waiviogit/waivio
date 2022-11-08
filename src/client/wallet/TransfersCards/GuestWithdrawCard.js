import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import TransactionCardContainer from './TransactionCardContainer';

const GuestWithdawCard = props => (
  <TransactionCardContainer
    timestamp={props.timestamp}
    symbol={props.symbol}
    quantity={props.quantity}
    memo={props.memo}
    iconType={'dollar'}
    color={'red'}
    fractionDigits={5}
  >
    <div>
      {' '}
      <FormattedMessage id="withdraw" defaultMessage="Withdraw" />{' '}
      {props.symbolOut === 'HIVE' ? (
        <React.Fragment>
          to <a href={`/@${props.to}`}>{props.to}</a>
        </React.Fragment>
      ) : null}
    </div>
  </TransactionCardContainer>
);

GuestWithdawCard.propTypes = {
  timestamp: PropTypes.number.isRequired,
  quantity: PropTypes.string.isRequired,
  symbol: PropTypes.string.isRequired,
  memo: PropTypes.string.isRequired,
  symbolOut: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
};

export default GuestWithdawCard;
