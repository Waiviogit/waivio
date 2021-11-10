import React from 'react';
import { Icon } from 'antd';
import PropTypes from 'prop-types';

import { FormattedDate, FormattedRelative } from 'react-intl';
import BTooltip from '../../../components/BTooltip';
import { epochToUTC } from '../../../helpers/formatter';

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
            if (hideFields.includes(item[0])) return null;

            return (
              <div key={item[0]}>
                <b>{item[0]}</b>: <span>{item[1]}</span>
              </div>
            );
          })}
        </div>
        <span className="UserWalletTransactions__timestamp">
          <BTooltip
            title={
              <span>
                <FormattedDate value={epochToUTC(transaction.timestamp)} />
              </span>
            }
          >
            <span>
              <FormattedRelative value={epochToUTC(transaction.timestamp)} />
            </span>
          </BTooltip>
        </span>
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
