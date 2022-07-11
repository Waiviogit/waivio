import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedDate, FormattedMessage, FormattedNumber, FormattedTime } from 'react-intl';
import { get, size, truncate, floor, ceil, round } from 'lodash';
import BTooltip from '../components/BTooltip';
import { epochToUTC } from '../../common/helpers/formatter';
import formatter from '../../common/helpers/steemitFormatter';
import * as accountHistoryConstants from '../../common/constants/accountHistory';

export const TRANSACTION_TYPES = [
  'internal_operations',
  'transfer',
  'transfer_to_vesting',
  'claim_reward_balance',
  'transfer_to_savings',
  'transfer_from_savings',
  'limit_order_cancel',
  'fill_order',
  'proposal_pay',
  'user_to_guest_transfer',
  'demo_post',
  'demo_debt',
  'demo_user_transfer',
  'limit_order_cancel',
];

export const selectFormatDate = locale => {
  if (locale === 'en-US') {
    return 'MM/DD/YYYY';
  }

  return 'DD/MM/YYYY';
};

export const getTransactionDescription = (type, options) => {
  switch (type) {
    case accountHistoryConstants.TRANSFER_TO_VESTING: {
      const from = get(options, 'from', 'user');
      const to = get(options, 'to', 'user');

      return {
        powerUpTransaction: <FormattedMessage id="power_up" defaultMessage="Power up " />,
        powerUpTransactionFrom: (
          <FormattedMessage
            id="power_up_from"
            defaultMessage="Power up from"
            values={{
              from: (
                <Link to={`/@${from}`}>
                  <span className="username">{from}</span>
                </Link>
              ),
            }}
          />
        ),
        powerUpTransactionTo: (
          <FormattedMessage
            id="power_up_to"
            defaultMessage="Power up to"
            values={{
              to: (
                <Link to={`/@${to}`}>
                  <span className="username">{to}</span>
                </Link>
              ),
            }}
          />
        ),
      };
    }
    case accountHistoryConstants.POWER_DOWN_INITIATED_OR_STOP: {
      return {
        powerDownStarted: (
          <FormattedMessage id="power_down_started" defaultMessage="Started power down" />
        ),
        powerDownStopped: <FormattedMessage id="power_down_stopped" defaultMessage="Power down" />,
      };
    }
    case accountHistoryConstants.POWER_DOWN_WITHDRAW: {
      const to = get(options, 'to', '');
      const from = get(options, 'from', '');

      return {
        powerDownWithdraw: (
          <FormattedMessage id="power_down_withdraw" defaultMessage="Power down" />
        ),
        powerDownWithdrawTo: (
          <FormattedMessage
            id="power_down_withdraw_to"
            defaultMessage="Power down to {to}"
            values={{
              to: (
                <Link to={`/@${to}`}>
                  <span className="username">{to}</span>
                </Link>
              ),
            }}
          />
        ),
        powerDownWithdrawFrom: (
          <FormattedMessage
            id="power_down_withdraw_from"
            defaultMessage="Power down from {from}"
            values={{
              from: (
                <Link to={`/@${from}`}>
                  <span className="username">{from}</span>
                </Link>
              ),
            }}
          />
        ),
      };
    }
    case accountHistoryConstants.TRANSFER: {
      const urlPost = get(options, 'urlPost', '');
      const urlComment = get(options, 'urlComment', '');
      const title = get(options, 'title', '');
      const isMobile = get(options, 'isMobile', false);
      const tableView = get(options, 'tableView', false);
      const from = get(options, 'from', '');
      const to = get(options, 'to', '');

      return {
        reviewAuthorRewards: (
          <FormattedMessage
            id="review_author_rewards"
            defaultMessage="Author rewards: {title}"
            values={{
              title: (
                <Link to={urlPost}>
                  <span className="username">
                    {tableView
                      ? title
                      : truncate(title, isMobile ? { length: 22 } : { length: 30 })}
                  </span>
                </Link>
              ),
            }}
          />
        ),
        commentsAuthorRewards: (
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
        ),
        receivedFrom: (
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
        ),
        transferredTo: (
          <FormattedMessage
            id="transferred_to"
            defaultMessage="Transferred to {username}"
            values={{
              username: (
                <Link to={`/@${to}`}>
                  <span className="username">{to}</span>
                </Link>
              ),
            }}
          />
        ),
      };
    }

    case accountHistoryConstants.TOKENS_TRANSFER: {
      const to = get(options, 'to', '');
      const from = get(options, 'from', '');

      return {
        tokensTransferTo: (
          <FormattedMessage
            id="transferred_to"
            defaultMessage="Transferred to {username}"
            values={{
              username: (
                <Link to={`/@${to}`}>
                  <span className="username">{to}</span>
                </Link>
              ),
            }}
          />
        ),
        tokensTransferFrom: (
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
        ),
      };
    }

    case accountHistoryConstants.CURATION_REWARDS: {
      const authorperm = get(options, 'authorperm', '');

      return {
        curationRewards: (
          <div>
            <FormattedMessage id="curator_rewards" defaultMessage="Curator rewards" />{' '}
            <Link to={`/${authorperm}`}>
              (<FormattedMessage id="post" defaultMessage="post" className="username" />)
            </Link>
          </div>
        ),
      };
    }
    case accountHistoryConstants.BENEFICIARY_REWARD: {
      const authorperm = get(options, 'authorperm', '');

      return {
        beneficiaryRewards: (
          <div>
            <FormattedMessage id="curator_rewards" defaultMessage="Curator rewards" />{' '}
            <Link to={`/${authorperm}`}>
              (
              <FormattedMessage
                id="comment_lowercase"
                defaultMessage="comment"
                className="username"
              />
              )
            </Link>
          </div>
        ),
      };
    }
    case accountHistoryConstants.CLAIM_REWARD_BALANCE:
      return {
        claimRewards: <FormattedMessage id="claim_rewards" defaultMessage="Claim rewards" />,
      };
    case accountHistoryConstants.MINING_LOTTERY:
      return {
        miningLottery: <FormattedMessage id="mining_rewards" defaultMessage="Mining rewards" />,
      };
    case accountHistoryConstants.AIRDROP:
      return {
        airdrop: <span>Airdrop</span>,
      };

    case accountHistoryConstants.TOKENS_STAKE:
      const to = get(options, 'to', '');
      const from = get(options, 'from', '');

      return {
        tokensStakeTo: (
          <FormattedMessage
            id="power_up_to"
            defaultMessage="Power up to {to}"
            values={{
              to: (
                <Link to={`/@${to}`}>
                  <span className="username">{to}</span>
                </Link>
              ),
            }}
          />
        ),
        tokensStakeFrom: (
          <FormattedMessage
            id="power_up_from"
            defaultMessage="Power up from {from}"
            values={{
              from: (
                <Link to={`/@${from}`}>
                  <span className="username">{from}</span>
                </Link>
              ),
            }}
          />
        ),
      };

    case accountHistoryConstants.AUTHOR_REWARDS: {
      const authorperm = get(options, 'authorperm', '');

      return {
        authorRewards: (
          <div>
            <FormattedMessage id="author_rewards" defaultMessage="Author rewards" />{' '}
            <Link to={`/${authorperm}`}>
              (<FormattedMessage id="post" defaultMessage="post" className="username" />)
            </Link>
          </div>
        ),
      };
    }
    case accountHistoryConstants.LIMIT_ORDER: {
      const openPays = get(options, 'openPays', null);
      const currentPays = get(options, 'currentPays', null);

      return {
        limitOrder: (
          <FormattedMessage
            id="limit_order"
            defaultMessage="Limit order"
            values={{
              open_pays: <span>{openPays}</span>,
              current_pays: <span>{currentPays}</span>,
            }}
          />
        ),
      };
    }
    case accountHistoryConstants.FILL_ORDER:
    case accountHistoryConstants.FILL_ORDER_TRANSACTION: {
      const url = get(options, 'url', '');
      const exchanger = get(options, 'exchanger', '');

      return {
        fillOrder: (
          <FormattedMessage
            id="exchange_with"
            defaultMessage="Exchange with {exchanger}"
            values={{
              exchanger: (
                <Link to={url}>
                  <span className="username">{exchanger}</span>
                </Link>
              ),
            }}
          />
        ),
      };
    }
    case accountHistoryConstants.CANCEL_ORDER: {
      const openPays = get(options, 'openPays', '');

      return {
        cancelOrder: (
          <FormattedMessage
            id="cancel_order"
            defaultMessage="Cancel order to buy {open_pays}"
            values={{
              open_pays: <span className="cancel-order-open-pays">{openPays}</span>,
            }}
          />
        ),
        cancelLimitOrder: (
          <FormattedMessage id="cancel_limit_order" defaultMessage="Cancel limit order" />
        ),
      };
    }
    case accountHistoryConstants.PROPOSAL_PAY: {
      const receiver = get(options, 'receiver', '');

      return {
        proposalPaymentFrom: (
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
        ),
        proposalPaymentTo: (
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
        ),
      };
    }
    default:
      return null;
  }
};

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

export const getTransactionTableCurrency = (amount, type, currency) => {
  if (!amount) return null;

  const transaction = amount.split(' ');
  const transactionAmount = parseFloat(get(transaction, '[0]', null));

  if (type === accountHistoryConstants.CANCEL_ORDER && !transactionAmount) return null;

  return {
    amount: round(transactionAmount, 3),
    currency: get(transaction, '[1]', currency),
  };
};

export const getTransactionCurrency = (amount, currency, type, tableView) => {
  if (!amount) return null;

  const transaction = amount.split(' ');
  const transactionAmount = parseFloat(get(transaction, '[0]', null));
  const transactionCurrency = get(transaction, '[1]', currency);
  const maximumFractionDigits = transactionAmount > 0.001 ? 3 : 6;

  if (type === accountHistoryConstants.CANCEL_ORDER && !transactionAmount) return null;

  if (tableView) {
    return {
      amount: round(transactionAmount, 3),
      currency: transactionCurrency,
    };
  }

  return (
    <span>
      <FormattedNumber value={transactionAmount} maximumFractionDigits={maximumFractionDigits} />
      {` ${transactionCurrency}`}
    </span>
  );
};

export const validateDate = (rule, value, callback) => {
  if (value && value.unix() * 1000 > Date.now()) {
    callback(rule.message);
  } else {
    callback();
  }
};

export const getCurrentRows = data => {
  const timestamp = get(data, 'time', null);
  const fieldHIVE = get(data, 'fieldHIVE', null);
  const fieldHP = get(data, 'fieldHP', null);
  const fieldHBD = get(data, 'fieldHBD', null);
  const fieldDescription = get(data, 'fieldDescription', null);
  const fieldMemo = get(data, 'fieldMemo', null);
  const fieldClassName = get(data, 'fieldClass', null);
  const hiveUSD = get(data, 'hiveUSD');
  const hbdUSD = get(data, 'hbdUSD');
  const withdrawDeposit = get(data, 'withdrawDeposit').toUpperCase();

  return (
    <tr>
      <td className={fieldClassName}>{timestamp}</td>
      <td className={fieldClassName}>{fieldHIVE}</td>
      <td className={fieldClassName}>{fieldHP}</td>
      <td className={fieldClassName}>{fieldHBD}</td>
      <td className={fieldClassName}>{hiveUSD && ceil(hiveUSD, 3)}</td>
      <td className={fieldClassName}>{hbdUSD && ceil(hbdUSD, 3)}</td>
      <td className={fieldClassName}>{withdrawDeposit}</td>
      <td className={fieldClassName}>{fieldDescription}</td>
      <td className={fieldClassName}>{fieldMemo}</td>
    </tr>
  );
};

export const validateGuestTransferTitle = (
  details,
  username,
  isMobile,
  transactionType,
  tableView,
) => {
  const postPermlink = get(details, 'post_permlink');
  const postParentAuthor = get(details, 'post_parent_author');
  const postParentPermlink = get(details, 'post_parent_permlink');
  const title = get(details, 'title');
  const post = details && postParentAuthor === '';

  const urlComment = `/@${postParentAuthor}/${postParentPermlink}#@${username}/${postPermlink}`;
  const urlPost = `/@${username}/${postPermlink}`;
  const description = getTransactionDescription(transactionType, {
    urlComment,
    urlPost,
    title,
    isMobile,
    tableView,
  });

  if (post) return description.reviewAuthorRewards;

  return description.commentsAuthorRewards;
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
        <FormattedNumber value={parsedRewardSteem} maximumFractionDigits={3} />
        {' HIVE'}
      </span>,
    );
  }

  if (parsedRewardSbd > 0) {
    payouts.push(
      <span key="HBD" className={usedClassName}>
        <FormattedNumber value={parsedRewardSbd} maximumFractionDigits={3} />
        {' HBD'}
      </span>,
    );
  }

  if (parsedRewardVests > 0) {
    payouts.push(
      <span key="HP" className={usedClassName}>
        <FormattedNumber value={parsedRewardVests} maximumFractionDigits={3} />
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
          defaultMessage="Transfer to savings {amount} from {username}"
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

export const fillOrderExchanger = (currentUsername, transaction) =>
  currentUsername === transaction.open_owner ? transaction.current_owner : transaction.open_owner;
