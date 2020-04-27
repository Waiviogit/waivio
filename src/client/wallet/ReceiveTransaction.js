import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import { FormattedMessage, FormattedRelative, FormattedDate, FormattedTime } from 'react-intl';
import BTooltip from '../components/BTooltip';
import Avatar from '../components/Avatar';
import { isGuestUser } from '../reducers';

const ReceiveTransaction = ({ from, memo, amount, timestamp }) => {
  const isGuest = useSelector(isGuestUser);
  return (
    <div className="UserWalletTransactions__transaction">
      {isGuest ? (
        <div className="UserWalletTransactions__icon-container">
          <i className="iconfont icon-success_fill UserWalletTransactions__icon" />
        </div>
      ) : (
        <div className="UserWalletTransactions__avatar">
          <Avatar username={from} size={40} />
        </div>
      )}
      <div className="UserWalletTransactions__content">
        <div className="UserWalletTransactions__content-recipient">
          <div>
            <FormattedMessage
              id={isGuest ? 'author_rewards' : 'received_from'}
              defaultMessage={isGuest ? 'Author rewards' : 'Received from {username}'}
              values={{
                username: (
                  <Link to={`/@${from}`}>
                    <span className="username">{from}</span>
                  </Link>
                ),
              }}
            />
          </div>
          <div className={classNames(`UserWalletTransactions__received ${isGuest ? 'guest' : ''}`)}>
            {isGuest ? '' : '+ '}
            {amount}
          </div>
        </div>
        <span className="UserWalletTransactions__timestamp">
          <BTooltip
            title={
              <span>
                <FormattedDate value={`${timestamp}Z`} /> <FormattedTime value={`${timestamp}Z`} />
              </span>
            }
          >
            <span>
              <FormattedRelative value={`${timestamp}Z`} />
            </span>
          </BTooltip>
        </span>
        <span className="UserWalletTransactions__memo">{memo}</span>
      </div>
    </div>
  );
};

ReceiveTransaction.propTypes = {
  from: PropTypes.string,
  memo: PropTypes.string,
  amount: PropTypes.element,
  timestamp: PropTypes.string,
};

ReceiveTransaction.defaultProps = {
  from: '',
  memo: '',
  amount: <span />,
  timestamp: '',
};

export default ReceiveTransaction;
