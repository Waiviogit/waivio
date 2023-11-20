import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
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
    fractionDigits={5}
  >
    <div>
      <span>
        {props.description}{' '}
        {props.authorperm && (
          <a href={`/${props.authorperm}`}>
            (<b>{props.type || <FormattedMessage id="post" defaultMessage="post" />}</b>)
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
  type: PropTypes.string.isRequired,
};

export default CuratorRewardsCard;
