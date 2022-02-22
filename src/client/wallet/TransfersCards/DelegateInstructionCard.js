import React from 'react';
import PropTypes from 'prop-types';

import TransactionCardContainer from './TransactionCardContainer';

const DelegateInstructionCard = props => (
  <TransactionCardContainer timestamp={props.timestamp} iconType={'wallet'}>
    <div>
      <div>Deposit instruction</div>
      {props.pair && (
        <p>
          <b>Pair:</b> {props.pair}
        </p>
      )}
      {props.depositAccount && (
        <p>
          <b>Account:</b> {props.depositAccount}
        </p>
      )}
      {props.memo && (
        <p>
          <b>Memo:</b> {props.memo}
        </p>
      )}
      {props.address && (
        <p>
          <b>Address:</b> {props.address}
        </p>
      )}
    </div>
  </TransactionCardContainer>
);

DelegateInstructionCard.propTypes = {
  timestamp: PropTypes.number.isRequired,
  pair: PropTypes.string,
  depositAccount: PropTypes.string,
  memo: PropTypes.string,
  address: PropTypes.string,
};

DelegateInstructionCard.defaultProps = {
  pair: '',
  depositAccount: '',
  memo: '',
  address: '',
};

export default DelegateInstructionCard;
