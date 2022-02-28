import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import Avatar from '../../components/Avatar';
import { getTransactionDescription, validateGuestTransferTitle } from '../WalletHelper';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import CardsTimeStamp from './CardsTimeStamp';

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
            style={{ color: '#54d2a0' }}
            className={classNames('UserWalletTransactions__received', {
              'UserWalletTransactions__received-self': userName === from,
            })}
          >
            {from !== to && '+ '}
            {amount}
          </div>
        </div>
        <CardsTimeStamp timestamp={isGuestPage ? `${timestamp}Z` : timestamp} />
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
  timestamp: PropTypes.number,
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
  timestamp: 0,
  isGuestPage: false,
  details: {},
  type: '',
  username: '',
  isMobile: false,
};

export default ReceiveTransaction;
