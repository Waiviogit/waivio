import React from 'react';
import PropTypes from 'prop-types';
import TransactionCardContainer from './TransactionCardContainer';

const CuratorRewardsCard = props => (
  <TransactionCardContainer
    timestamp={props.timestamp}
    symbol={props.symbol}
    quantity={props.quantity}
    account={props.account}
    memo={props.memo}
    iconType={'wallet'}
    color={'green'}
    point={'+'}
    fractionDigits={5}
  >
    <div>
      <span>
        {props.description}{' '}
        {props.authorperm && (
          <a href={`/${props.authorperm}`}>
            (<b>post</b>)
          </a>
        )}
      </span>
    </div>
  </TransactionCardContainer>
);

CuratorRewardsCard.propTypes = {
  timestamp: PropTypes.number.isRequired,
  quantity: PropTypes.string.isRequired,
  account: PropTypes.string.isRequired,
  symbol: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  authorperm: PropTypes.string.isRequired,
  memo: PropTypes.string.isRequired,
};

export default CuratorRewardsCard;
