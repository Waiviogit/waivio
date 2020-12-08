import React from 'react';
import PropTypes from 'prop-types';
import { FormattedRelative } from 'react-intl';
import BTooltip from '../components/BTooltip';
import Avatar from '../components/Avatar';
import { epochToUTC } from '../helpers/formatter';
import { getTransactionDescription, selectCurrectFillOrderValue } from './WalletHelper';

const WalletFillOrderTransferred = ({
  transactionDetails,
  timestamp,
  currentPays,
  openPays,
  exchanger,
  currentUsername,
  transactionType,
}) => {
  const url = `/@${exchanger}`;
  const currentOrderValue = selectCurrectFillOrderValue(
    transactionDetails,
    currentPays,
    openPays,
    currentUsername,
  );
  const options = { url, exchanger };
  const description = getTransactionDescription(transactionType, options);
  return (
    <React.Fragment>
      <div className="UserWalletTransactions__transaction">
        <div className="UserWalletTransactions__avatar">
          <Avatar username={exchanger} size={40} />
        </div>
        <div className="UserWalletTransactions__content">
          <div className="UserWalletTransactions__content-recipient">
            <div>{description.fillOrder}</div>
            <span className="UserWalletTransactions__transfer">
              {'- '}
              {currentOrderValue.transfer}
              &ensp;
              <span className="UserWalletTransactions__received">
                {'+ '}
                {currentOrderValue.received}
              </span>
            </span>
          </div>
          <span className="UserWalletTransactions__timestamp">
            <BTooltip
              title={
                <span>
                  <FormattedRelative value={epochToUTC(timestamp)} />
                </span>
              }
            >
              <span>
                <FormattedRelative value={epochToUTC(timestamp)} />
              </span>
            </BTooltip>
          </span>
        </div>
      </div>
    </React.Fragment>
  );
};

WalletFillOrderTransferred.propTypes = {
  transactionDetails: PropTypes.shape().isRequired,
  transactionType: PropTypes.string.isRequired,
  timestamp: PropTypes.number,
  currentPays: PropTypes.element,
  openPays: PropTypes.element,
  exchanger: PropTypes.string,
  currentUsername: PropTypes.string,
};

WalletFillOrderTransferred.defaultProps = {
  timestamp: 0,
  currentPays: <span />,
  openPays: <span />,
  exchanger: '',
  currentUsername: '',
};

export default WalletFillOrderTransferred;
