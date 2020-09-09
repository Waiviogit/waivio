import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedDate, FormattedMessage, FormattedNumber, FormattedTime } from 'react-intl';
import { get, size, truncate, floor } from 'lodash';
import BTooltip from '../components/BTooltip';
import { epochToUTC } from '../helpers/formatter';
import formatter from '../helpers/steemitFormatter';
import * as accountHistoryConstants from '../../common/constants/accountHistory';

export const TRANSACTION_TYPES = [
  'internal_operations',
  'transfer',
  'transfer_to_vesting',
  'claim_reward_balance',
  'transfer_to_savings',
  'transfer_from_savings',
  'limit_order_cancel',
  'limit_order_create',
  'fill_order',
  'proposal_pay',
  'user_to_guest_transfer',
  'demo_post',
  'demo_debt',
  'demo_user_transfer',
];
// eslint-disable-next-line import/prefer-default-export
export const handleLoadMoreTransactions = ({
  username,
  operationNumber,
  isLoadingMore,
  demoIsLoadingMore,
  getMoreFunction,
  getMoreDemoFunction,
  transferActions,
  isGuest,
  table,
  fromDate,
  tillDate,
  types,
}) => {
  // Todo: переписать!
  let skip = 0;
  const limit = 10;
  const transferActionsLength = size(transferActions);
  if (isGuest) {
    if (transferActionsLength >= limit) {
      skip = transferActionsLength;
    }
    if (!demoIsLoadingMore) {
      getMoreDemoFunction(username, skip, limit);
    }
  }

  if (!isGuest && table && !isLoadingMore) {
    getMoreFunction(username, limit, table, fromDate, tillDate, types, operationNumber);
  }

  if (!isGuest && !table && !isLoadingMore) {
    getMoreFunction(username, limit, operationNumber);
  }
};

export const getDataDemoTransactions = (username, demoTransactionsHistory) => {
  const transactions = [];
  const demoTransactions = get(demoTransactionsHistory, username, []);
  demoTransactions.forEach(transaction => {
    const timestamp = get(transaction, 'timestamp', {});
    const typeTransaction = get(transaction, 'op[0]', {});
    const data = get(transaction, 'op[1]', {});
    data.timestamp = timestamp;
    data.type = typeTransaction;
    transactions.push(data);
  });
  return transactions;
};

export const dateTableField = (timestamp, isGuestPage) => (
  <BTooltip
    title={
      <span>
        <FormattedDate value={isGuestPage ? `${timestamp}Z` : epochToUTC(timestamp)} />{' '}
        <FormattedTime value={isGuestPage ? `${timestamp}Z` : epochToUTC(timestamp)} />
      </span>
    }
  >
    <span>
      <FormattedDate value={isGuestPage ? `${timestamp}Z` : epochToUTC(timestamp)} />
    </span>
  </BTooltip>
);

export const getTransactionCurrency = (amount, currency, type) => {
  if (!amount) {
    return null;
  }
  const transaction = amount.split(' ');
  const transactionAmount = parseFloat(get(transaction, '[0]', null));
  const transactionCurrency = get(transaction, '[1]', currency);

  if (type === accountHistoryConstants.CANCEL_ORDER) {
    if (!transactionAmount) {
      return null;
    }
  }

  return {
    amount: transactionAmount,
    currency: transactionCurrency,
  };
};

export const getCurrentRows = data => {
  const timestamp = get(data, 'time', null);
  const fieldHIVE = get(data, 'fieldHIVE', null);
  const fieldHP = get(data, 'fieldHP', null);
  const fieldHBD = get(data, 'fieldHBD', null);
  const fieldDescription = get(data, 'fieldDescription', null);
  const fieldMemo = get(data, 'fieldMemo', null);

  return (
    <React.Fragment>
      <tr>
        <td>{timestamp}</td>
        <td>{fieldHIVE}</td>
        <td>{fieldHP}</td>
        <td>{fieldHBD}</td>
        <td>{fieldDescription}</td>
        <td>{fieldMemo}</td>
      </tr>
    </React.Fragment>
  );
};

export const validateGuestTransferTitle = (details, username, isMobile) => {
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
              <span className="username">
                {truncate(title, isMobile ? { length: 22 } : { length: 30 })}
              </span>
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

export const getFormattedClaimRewardPayout = (
  rewardSteem,
  rewardSbd,
  rewardVests,
  totalVestingShares,
  totalVestingFundSteem,
  usedClassName,
) => {
  const payouts = [];
  const parsedRewardSteem = parseFloat(rewardSteem);
  const parsedRewardSbd = parseFloat(rewardSbd);
  const parsedRewardVests = parseFloat(
    formatter.vestToSteem(rewardVests, totalVestingShares, totalVestingFundSteem),
  );

  if (parsedRewardSteem > 0) {
    payouts.push(
      <span key="HIVE" className={usedClassName}>
        <FormattedNumber
          value={parsedRewardSteem}
          minimumFractionDigits={3}
          maximumFractionDigits={3}
        />
        {' HIVE'}
      </span>,
    );
  }

  if (parsedRewardSbd > 0) {
    payouts.push(
      <span key="HBD" className={usedClassName}>
        <FormattedNumber
          value={parsedRewardSbd}
          minimumFractionDigits={3}
          maximumFractionDigits={3}
        />
        {' HBD'}
      </span>,
    );
  }

  if (parsedRewardVests > 0) {
    payouts.push(
      <span key="HP" className={usedClassName}>
        <FormattedNumber
          value={parsedRewardVests}
          minimumFractionDigits={3}
          maximumFractionDigits={3}
        />
        {' HP'}
      </span>,
    );
  }
  return {
    payouts,
    HIVE: parsedRewardSteem ? floor(parsedRewardSteem, 3) : null,
    HBD: parsedRewardSbd ? floor(parsedRewardSbd, 3) : null,
    HP: parsedRewardVests ? floor(parsedRewardVests, 3) : null,
  };
};

export const getSavingsTransactionMessage = (transactionType, transactionDetails, amount) => {
  switch (transactionType) {
    case 'cancel_transfer_from_savings':
      return (
        <FormattedMessage
          id="cancel_transfer_from_savings"
          defaultMessage="Cancel transfer from savings (request {requestId})"
          values={{
            requestId: transactionDetails.request_id,
          }}
        />
      );
    case 'transfer_to_savings':
      return (
        <FormattedMessage
          id="transfer_to_savings"
          defaultMessage="Transfer to savings {amount} to {username}"
          values={{
            amount,
            username: (
              <Link to={`/@${transactionDetails.to}`}>
                <span className="username">{transactionDetails.to}</span>
              </Link>
            ),
          }}
        />
      );
    case 'transfer_from_savings':
      return (
        <FormattedMessage
          id="transfer_from_savings"
          defaultMessage="Transfer from savings {amount} to {username}"
          values={{
            amount,
            username: (
              <Link to={`/@${transactionDetails.from}`}>
                <span className="username">{transactionDetails.from}</span>
              </Link>
            ),
          }}
        />
      );
    default:
      return null;
  }
};

export const selectCurrectFillOrderValue = (
  transactionDetails,
  currentPays,
  openPays,
  currentUsername,
) =>
  currentUsername === transactionDetails.current_owner
    ? {
        transfer: currentPays,
        received: openPays,
      }
    : {
        transfer: openPays,
        received: currentPays,
      };
