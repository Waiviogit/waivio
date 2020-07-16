import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import { Link } from 'react-router-dom';
import BTooltip from '../components/BTooltip';
import Avatar from '../components/Avatar';
import { epochToUTC } from '../helpers/formatter';

const WalletFillOrderGet = ({ transactionDetails, timestamp }) => {
  const url = `/@${transactionDetails.exchanger}`;
  return (
    <React.Fragment>
      <div className="UserWalletTransactions__transaction">
        <div className="UserWalletTransactions__avatar">
          <Avatar username={transactionDetails.account} size={40} />
        </div>
        <div className="UserWalletTransactions__content">
          <div className="UserWalletTransactions__content-recipient">
            <div>
              <FormattedMessage
                id="fillOrder_wallet_get"
                defaultMessage="Bought {open_pays} from {exchanger}"
                values={{
                  open_pays: <span>{transactionDetails.open_pays}</span>,
                  exchanger: (
                    <Link to={url}>
                      <span className="username">{transactionDetails.exchanger}</span>
                    </Link>
                  ),
                }}
              />
            </div>
            <div className="UserWalletTransactions__received">
              {'+ '}
              {transactionDetails.open_pays}
            </div>
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

WalletFillOrderGet.propTypes = {
  transactionDetails: PropTypes.arrayOf(PropTypes.object).isRequired,
  timestamp: PropTypes.number,
  open_pays: PropTypes.string,
};

WalletFillOrderGet.defaultProps = {
  timestamp: 0,
  open_pays: '',
};

export default WalletFillOrderGet;
