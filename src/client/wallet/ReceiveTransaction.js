import React from 'react';
import PropTypes from 'prop-types';
import { truncate } from 'lodash';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import { FormattedMessage, FormattedRelative, FormattedDate, FormattedTime } from 'react-intl';
import BTooltip from '../components/BTooltip';
import Avatar from '../components/Avatar';
import { getAuthenticatedUserName } from '../reducers';
import { epochToUTC } from '../helpers/formatter';

const validateTitle = (details, username) => {
  const postPermlink = details && details.post_permlink;
  const postParentAuthor = details && details.post_parent_author;
  const postParentPermlink = details && details.post_parent_permlink;
  const title = details && details.title;
  const post = details && postParentAuthor === '';

  const urlComment = `/@${postParentAuthor}/${postParentPermlink}#@${username}/${postPermlink}`;

  if (post) {
    const urlPost = `/@${username}/${postPermlink}`;
    return (
      <FormattedMessage
        id="review_author_rewards"
        defaultMessage="Author rewards: {title}"
        values={{
          title: (
            <Link to={urlPost}>
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
          <Link to={urlComment}>
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
  const userName = useSelector(getAuthenticatedUserName);
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
          <div
            className={classNames('UserWalletTransactions__received', {
              'UserWalletTransactions__received-self': userName === from,
            })}
          >
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
  timestamp: PropTypes.number,
  isGuestPage: PropTypes.bool,
  details: PropTypes.shape(),
  type: PropTypes.string,
  username: PropTypes.string,
};

ReceiveTransaction.defaultProps = {
  from: '',
  memo: '',
  amount: <span />,
  timestamp: 0,
  isGuestPage: false,
  details: null,
  type: '',
  username: '',
};

export default ReceiveTransaction;
