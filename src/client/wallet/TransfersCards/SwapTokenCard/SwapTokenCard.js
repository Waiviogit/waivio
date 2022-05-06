import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import BigNumber from 'bignumber.js';
import { Icon } from 'antd';

import './SwapTokenCard.less';

import CardsTimeStamp from '../CardsTimeStamp';

const SwapTokenCard = props => {
  const price = BigNumber(props.quantityTo)
    .dividedBy(props.quantityFrom)
    .toFixed(3);

  return (
    <React.Fragment>
      <div className="UserWalletTransactions__transaction">
        <div className="UserWalletTransactions__icon-container">
          <Icon
            type={'swap'}
            style={{ fontSize: '16px' }}
            className="UserWalletTransactions__icon"
          />
        </div>
        <div className="UserWalletTransactions__content">
          <div className="UserWalletTransactions__content-recipient SwapTokenCard__amount_column">
            <div>
              <FormattedMessage id="swap" defaultMessage="Swap" />
            </div>
            <div>
              <span className={'SwapTokenCard__from'}>
                -{' '}
                <FormattedNumber
                  value={props.quantityFrom}
                  locale={'en-IN'}
                  minimumFractionDigits={3}
                  maximumFractionDigits={3}
                />{' '}
                {props.symbolFrom}
              </span>
              <span className={'SwapTokenCard__to'}>
                +{' '}
                <FormattedNumber
                  value={props.quantityTo}
                  locale={'en-IN'}
                  minimumFractionDigits={3}
                  maximumFractionDigits={3}
                />{' '}
                {props.symbolTo}
              </span>
            </div>
          </div>
          <div className="MarketBuyCard__lower-text">
            <CardsTimeStamp timestamp={props.timestamp} />
            <div className="MarketBuyCard__per-waiv">
              {' '}
              <FormattedNumber
                value={price}
                locale={'en-IN'}
                minimumFractionDigits={0}
                maximumFractionDigits={3}
              />{' '}
              {props.symbolTo} {`per ${props.symbolFrom}`}
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

SwapTokenCard.propTypes = {
  timestamp: PropTypes.number.isRequired,
  quantityFrom: PropTypes.string.isRequired,
  quantityTo: PropTypes.string.isRequired,
  symbolFrom: PropTypes.string.isRequired,
  symbolTo: PropTypes.string.isRequired,
};

export default SwapTokenCard;
