import React from 'react';
import PropTypes from 'prop-types';
import { round } from 'lodash';

import './SwapTokenCard.less';

import TransactionCardContainer from '../TransactionCardContainer';

const SwapTokenCard = props => (
  <TransactionCardContainer timestamp={props.timestamp} iconType={'swap'} symbol={props.symbolTo}>
    <div className={'SwapTokenCard'}>
      <span>Swap</span>
      <div>
        <span className={'SwapTokenCard__from'}>
          - {round(+props.quantityFrom, 3)} {props.symbolFrom}
        </span>{' '}
        <span className={'SwapTokenCard__to'}>
          + {round(+props.quantityTo, 3)} {props.symbolTo}
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
