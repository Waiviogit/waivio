import React from 'react';
import { Icon } from 'antd';
import PropTypes from 'prop-types';
import CardsTimeStamp from '../CardsTimeStamp';

import './UnknownTransactionType.less';

const UnknownTransactionType = ({ transaction }) => {
  const hideFields = ['_id', 'blockNumber', 'timestamp'];

  return (
    <div className="UnknownTransactionType">
      <div className="UnknownTransactionType__icon-container">
        <Icon type="question-circle-o" />
      </div>
      <div className="UnknownTransactionType__info-container">
        <div className="UnknownTransactionType__info">
          {Object.entries(transaction).map(item => {
            if (hideFields.includes(item[0]) || !item[1]) return null;

            return (
              <div key={item[0]}>
                <b>{item[0]}</b>: <span>{JSON.stringify(item[1])}</span>
              </div>
            );
          })}
        </div>
        <CardsTimeStamp timestamp={transaction.timestamp} />
      </div>
    </div>
  );
};

UnknownTransactionType.propTypes = {
  transaction: PropTypes.shape({
    to: PropTypes.string,
    from: PropTypes.string,
    memo: PropTypes.string,
    quantity: PropTypes.string,
    timestamp: PropTypes.string,
    details: PropTypes.string,
    account: PropTypes.string,
    operation: PropTypes.string,
  }).isRequired,
};

export default UnknownTransactionType;
