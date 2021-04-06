import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import { FormattedRelative, FormattedDate, FormattedTime } from 'react-intl';
import BTooltip from '../components/BTooltip';
import Avatar from '../components/Avatar';
import { epochToUTC } from '../helpers/formatter';
import { getTransactionDescription, validateGuestTransferTitle } from './WalletHelper';
import { getAuthenticatedUserName } from '../store/authStore/authSelectors';

const ReceiveTransaction = ({
  from,
  to,
  memo,
  amount,
  timestamp,
  isGuestPage,
  details,
  type,
  username,
  isMobile,
  transactionType,
}) => {
  const userName = useSelector(getAuthenticatedUserName);
  const demoPost = type === 'demo_post';
  const options = { from };
  const description = getTransactionDescription(transactionType, options);

  return (
    <div className="UserWalletTransactions__transaction">
      <div className="UserWalletTransactions__avatar">
        <Avatar username={from} size={40} />
      </div>
      <div className="UserWalletTransactions__content">
        <div className="UserWalletTransactions__content-recipient">
          <div>
            {demoPost
              ? validateGuestTransferTitle(details, username, isMobile, transactionType)
              : description.receivedFrom}
          </div>
          <div
            className={classNames('UserWalletTransactions__received', {
              'UserWalletTransactions__received-self': userName === from,
            })}
          >
            {from !== to && '+ '}
            {amount}
          </div>
        </div>
        <span className="UserWalletTransactions__timestamp">
          {isGuestPage ? (
            <BTooltip
              title={
                <span>
                  <FormattedDate value={`${timestamp}Z`} />{' '}
                  <FormattedTime value={`${timestamp}Z`} />
                </span>
              }
            >
              <span>
                <FormattedRelative value={`${timestamp}Z`} />
              </span>
            </BTooltip>
          ) : (
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
          )}
        </span>
        <span className="UserWalletTransactions__memo">{memo}</span>
      </div>
    </div>
  );
};

ReceiveTransaction.propTypes = {
  from: PropTypes.string,
  to: PropTypes.string,
  memo: PropTypes.string,
  amount: PropTypes.element,
  timestamp: PropTypes.string,
  isGuestPage: PropTypes.bool,
  details: PropTypes.shape(),
  type: PropTypes.string,
  username: PropTypes.string,
  isMobile: PropTypes.bool,
  transactionType: PropTypes.string.isRequired,
};

ReceiveTransaction.defaultProps = {
  from: '',
  to: '',
  memo: '',
  amount: <span />,
  timestamp: '',
  isGuestPage: false,
  details: {},
  type: '',
  username: '',
  isMobile: false,
};

export default ReceiveTransaction;
