import React from 'react';
import BigNumber from 'bignumber.js';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { FormattedMessage, FormattedNumber } from 'react-intl';
import CardsTimeStamp from '../CardsTimeStamp';
import Avatar from '../../../components/Avatar';

const SwapTokenCartForHistory = props => {
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
          <Avatar username={props.from} size={40} />
        </div>
        <div className="UserWalletTransactions__content">
          <div className="UserWalletTransactions__content-recipient SwapTokenCard__amount_column">
            <div>
              <FormattedMessage id="swap" defaultMessage="Swap" /> by{' '}
              <Link to={`/@${props.from}`} style={{ color: '#595959', fontWeight: 500 }}>
                {props.from}
              </Link>
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

SwapTokenCartForHistory.propTypes = {
  timestamp: PropTypes.number,
  symbolTo: PropTypes.string,
  quantityTo: PropTypes.number,
  symbolFrom: PropTypes.string,
  quantityFrom: PropTypes.number,
  from: PropTypes.string,
};

export default SwapTokenCartForHistory;
