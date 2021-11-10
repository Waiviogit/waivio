import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '../../components/Avatar';
import { getTransactionDescription, selectCurrectFillOrderValue } from '../WalletHelper';
import CardsTimeStamp from './CardsTimeStamp';

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
          <CardsTimeStamp timestamp={timestamp} />
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
