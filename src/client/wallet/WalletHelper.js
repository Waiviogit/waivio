import { size } from 'lodash';

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
