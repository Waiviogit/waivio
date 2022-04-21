import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Icon } from 'antd';
import CardsTimeStamp from '../CardsTimeStamp';

import './DelegateInstructionCard.less';

const DelegateInstructionCard = props => {
  const feeRate = props.rate - 0.0075;

  return (
    <div className="UserWalletTransactions__transaction DelegateInstructionCard">
      <div className="UserWalletTransactions__icon-container">
        <Icon
          type={'wallet'}
          style={{ fontSize: '16px' }}
          className="UserWalletTransactions__icon"
        />
      </div>
      <div className="UserWalletTransactions__content">
        <div>
          <span>
            <FormattedMessage id="deposit_instruction" defaultMessage="Deposit instruction" />
          </span>
          {props.rate && (
            <div>
              <b>Rate:</b> 1 {props.symbolIn} {'>'} {feeRate} {props.symbolOut}
            </div>
          )}
          {props.depositAccount && (
            <div>
              <b>Send to:</b> {props.depositAccount}
            </div>
          )}
          {props.memo && (
            <div>
              <b>Memo:</b> {props.memo}
            </div>
          )}
          {props.address && (
            <div className="DelegateInstructionCard__address">
              <b>Address:</b> {props.address}
            </div>
          )}
        </div>
        <CardsTimeStamp timestamp={props.timestamp} />
      </div>
    </div>
  );
};

DelegateInstructionCard.propTypes = {
  timestamp: PropTypes.number.isRequired,
  rate: PropTypes.string,
  symbolIn: PropTypes.string,
  symbolOut: PropTypes.string,
  depositAccount: PropTypes.string,
  memo: PropTypes.string,
  address: PropTypes.string,
};

DelegateInstructionCard.defaultProps = {
  symbolIn: '',
  symbolOut: '',
  rate: '',
  depositAccount: '',
  memo: '',
  address: '',
};

export default DelegateInstructionCard;
