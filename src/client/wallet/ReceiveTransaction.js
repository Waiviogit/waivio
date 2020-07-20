import React from 'react';
import PropTypes from 'prop-types';
import { truncate } from 'lodash';
import { Link } from 'react-router-dom';
import { FormattedMessage, FormattedRelative, FormattedDate, FormattedTime } from 'react-intl';
import BTooltip from '../components/BTooltip';
import Avatar from '../components/Avatar';
import { epochToUTC } from '../helpers/formatter';

const validateTitle = (details, username) => {
  const postPermlink = details && details.post_permlink;
  const title = details && details.title;
  const reviewPost = details && details.title.search('Review:');
  const url = `/@${username}/${postPermlink}`;

  if (reviewPost === 0) {
    return (
      <FormattedMessage
        id="review_author_rewards"
        defaultMessage="Author rewards: {title}"
        values={{
          title: (
            <Link to={url}>
              <span className="username">{truncate(title, { length: 30 })}</span>
            </Link>
          ),
        }}
      />
    );
  }
  return (
    <FormattedMessage
      id="comments_author_rewards"
      defaultMessage="Author rewards for comments: {title}"
      values={{
        title: (
          <Link to={url}>
            <span className="username">{truncate(title, { length: 15 })}</span>
          </Link>
        ),
      }}
    />
  );
};

const ReceiveTransaction = ({
  from,
  memo,
  amount,
  timestamp,
  isGuestPage,
  details,
  type,
  username,
}) => {
  const demoPost = type === 'demo_post';
  return (
    <div className="UserWalletTransactions__transaction">
      <div className="UserWalletTransactions__avatar">
        <Avatar username={from} size={40} />
      </div>
      <div className="UserWalletTransactions__content">
        <div className="UserWalletTransactions__content-recipient">
          <div>
            {demoPost ? (
              validateTitle(details, username)
            ) : (
              <FormattedMessage
                id="received_from"
                defaultMessage="Received from {username}"
                values={{
                  username: (
                    <Link to={`/@${from}`}>
                      <span className="username">{from}</span>
                    </Link>
                  ),
                }}
              />
            )}
          </div>
          <div className="UserWalletTransactions__received">
            {'+ '}
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
  memo: PropTypes.string,
  amount: PropTypes.element,
  timestamp: PropTypes.string,
  isGuestPage: PropTypes.bool,
  details: PropTypes.shape(),
  type: PropTypes.string,
  username: PropTypes.string,
};

ReceiveTransaction.defaultProps = {
  from: '',
  memo: '',
  amount: <span />,
  timestamp: '',
  isGuestPage: false,
  details: null,
  type: '',
  username: '',
};

export default ReceiveTransaction;
