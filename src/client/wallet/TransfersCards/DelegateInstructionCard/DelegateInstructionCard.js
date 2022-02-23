import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import CardsTimeStamp from '../CardsTimeStamp';

import './DelegateInstructionCard.less';

const DelegateInstructionCard = props => (
  <div className="UserWalletTransactions__transaction DelegateInstructionCard">
    <div className="UserWalletTransactions__icon-container">
      <Icon type={'wallet'} style={{ fontSize: '16px' }} className="UserWalletTransactions__icon" />
    </div>
    <div className="UserWalletTransactions__content">
      <div>
        <span>Deposit instruction</span>
        {props.pair && (
          <div>
            <b>Pair:</b> {props.pair}
          </div>
        )}
        {props.depositAccount && (
          <div>
            <b>Account:</b> {props.depositAccount}
          </div>
        )}
        {props.memo && (
          <div>
            <b>Memo:</b> {props.memo}
          </div>
        )}
        {props.address && (
          <div>
            <b>Address:</b> {props.address}
          </div>
        )}
      </div>
      <CardsTimeStamp timestamp={props.timestamp} />
    </div>
  </div>
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
