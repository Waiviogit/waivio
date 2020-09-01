import React from 'react';
import { FormattedDate, FormattedTime } from 'react-intl';
import { get, size } from 'lodash';
import BTooltip from '../components/BTooltip';
import { epochToUTC } from '../helpers/formatter';

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
}) => {
  let skip = 0;
  const limit = 10;
  const transferActionsLength = size(transferActions);
  if (isGuest) {
    if (transferActionsLength >= limit) {
      skip = transferActionsLength;
    }
    if (!demoIsLoadingMore) getMoreDemoFunction(username, skip, limit);
  }
  if (!isLoadingMore) getMoreFunction(username, limit, operationNumber);
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

export const getTransactionCurrency = (amount, currency) => {
  if (!amount) {
    return null;
  }
  const transaction = amount.split(' ');
  const transactionAmount = parseFloat(get(transaction, '[0]', null));
  const transactionCurrency = get(transaction, '[1]', currency);
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
        <td className="">{timestamp}</td>
        <td className="">{fieldHIVE}</td>
        <td className="">{fieldHP}</td>
        <td className="">{fieldHBD}</td>
        <td className="">{fieldDescription}</td>
        <td className="">{fieldMemo}</td>
      </tr>
    </React.Fragment>
  );
};
