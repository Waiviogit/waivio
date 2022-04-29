import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import LogoHiveWalletIcon from '@icons/logo-hive-wallet.svg';
import BTooltip from '../components/BTooltip';
import { epochToUTC } from '../../common/helpers/formatter';
import { getTransactionDescription } from './WalletHelper';

const WalletProposalPay = ({
  receiver,
  payment,
  timestamp,
  withdraw,
  getDetails,
  currentUsername,
  transactionType,
}) => {
  const options = { receiver };
  const description = getTransactionDescription(transactionType, options);

  return (
    <div className="UserWalletTransactions__transaction">
      <div className="UserWalletTransactions__icon-container">
        <img className="UserWalletTransactions__icon" src={LogoHiveWalletIcon} alt="hive" />
      </div>
      <div className="UserWalletTransactions__content">
        <div className="UserWalletTransactions__content-recipient">
          <div>
            {' '}
            {receiver === currentUsername && receiver !== 'steem.dao'
              ? description.proposalPaymentFrom
              : description.proposalPaymentTo}
          </div>
          {receiver === currentUsername && receiver !== 'steem.dao' ? (
            <div className="UserWalletTransactions__received">
              {'+ '}
              {payment}
            </div>
          ) : (
            <div className="UserWalletTransactions__transfer">
              {'- '}
              {payment}
            </div>
          )}
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
        {withdraw && (
          <a onClick={() => getDetails(withdraw)} role="presentation">
            <FormattedMessage id="details" defaultMessage="Details" />
          </a>
        )}
      </div>
    </div>
  );
};

WalletProposalPay.propTypes = {
  transactionType: PropTypes.string.isRequired,
  receiver: PropTypes.string,
  payment: PropTypes.element,
  timestamp: PropTypes.number,
  withdraw: PropTypes.string,
  getDetails: PropTypes.func,
  currentUsername: PropTypes.string,
};

WalletProposalPay.defaultProps = {
  receiver: '',
  memo: '',
  payment: <span />,
  timestamp: 0,
  withdraw: '',
  getDetails: () => {},
  currentUsername: '',
};

export default WalletProposalPay;
