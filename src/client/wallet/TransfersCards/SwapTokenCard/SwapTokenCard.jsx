import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { Icon } from 'antd';
import classNames from 'classnames';
import BigNumber from 'bignumber.js';
import CardsTimeStamp from '../CardsTimeStamp';
import './SwapTokenCard.less';

const SwapTokenCard = props => {
  const price = BigNumber(props.quantityTo)
    .dividedBy(props.quantityFrom)
    .toFixed(3);

  const largeAmount = props.quantityTo > 99 || props.quantityFrom > 99;
  const amountToClass = classNames('SwapTokenCard__to', {
    'SwapTokenCard__margin-left': !largeAmount,
  });

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
            <div className={largeAmount && 'SwapTokenCard__large-amount-column'}>
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
              <span className={amountToClass}>
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
