import React from 'react';
import PropTypes from 'prop-types';
import { FormattedNumber } from 'react-intl';

import './SwapTokenCard.less';

import TransactionCardContainer from '../TransactionCardContainer';

const SwapTokenCard = props => (
  <TransactionCardContainer timestamp={props.timestamp} iconType={'swap'} symbol={props.symbolTo}>
    <div className={'SwapTokenCard'}>
      <div>Swap</div>
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
        </span>{' '}
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
  </TransactionCardContainer>
);

SwapTokenCard.propTypes = {
  timestamp: PropTypes.number.isRequired,
  quantityFrom: PropTypes.string.isRequired,
  quantityTo: PropTypes.string.isRequired,
  symbolFrom: PropTypes.string.isRequired,
  symbolTo: PropTypes.string.isRequired,
};

export default SwapTokenCard;
