import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FormattedMessage, FormattedRelative } from 'react-intl';
import BTooltip from '../components/BTooltip';
import { epochToUTC } from '../helpers/formatter';

const WalletProposalPay = ({
  receiver,
  payment,
  timestamp,
  withdraw,
  getDetails,
  currentUsername,
}) => (
  <div className="UserWalletTransactions__transaction">
    <div className="UserWalletTransactions__icon-container">
      <img
        className="UserWalletTransactions__icon"
        src="/images/icons/logo-hive-wallet.svg"
        alt="hive"
      />
    </div>
    <div className="UserWalletTransactions__content">
      <div className="UserWalletTransactions__content-recipient">
        <div>
          {' '}
          {receiver === currentUsername && receiver !== 'steem.dao' ? (
            <FormattedMessage
              id="proposal_payment_from"
              defaultMessage="Proposal payment from {steem_dao}"
              values={{
                steem_dao: (
                  <Link to={`/@steem.dao`}>
                    <span className="username">steem.dao</span>
                  </Link>
                ),
              }}
            />
          ) : (
            <FormattedMessage
              id="proposal_payment_to"
              defaultMessage="Proposal payment to {receiver}"
              values={{
                receiver: (
                  <Link to={`/@${receiver}`}>
                    <span className="username">{receiver}</span>
                  </Link>
                ),
              }}
            />
          )}
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

WalletProposalPay.propTypes = {
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
