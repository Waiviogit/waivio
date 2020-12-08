import { isEmpty, includes, get, first } from 'lodash';
import * as accountHistoryConstants from '../../common/constants/accountHistory';

export const ACTIONS_DISPLAY_LIMIT = 100;

export const getVoteFilterType = actionDetails => {
  let voteType = accountHistoryConstants.UNVOTED;

  if (actionDetails.weight > 0) {
    voteType = accountHistoryConstants.UPVOTED;
  } else if (actionDetails.weight < 0) {
    voteType = accountHistoryConstants.DOWNVOTED;
  }

  return voteType;
};

export const getCustomJSONFilterType = actionDetails => {
  const actionJSON = JSON.parse(actionDetails.json);
  const customActionType = actionJSON[0];
  const customActionDetails = actionJSON[1];

  if (customActionType === accountHistoryConstants.FOLLOW) {
    if (customActionDetails.type_operation === 'follow_wobject') {
      return `+${accountHistoryConstants.FOLLOWED}`;
    } else if (customActionDetails.type_operation === 'unfollow_wobject') {
      return `-${accountHistoryConstants.UNFOLLOWED}`;
    }

    return '';
  } else if (customActionType === accountHistoryConstants.REBLOG) {
    return accountHistoryConstants.REBLOGGED;
  } else if (customActionType === accountHistoryConstants.FOLLOW_WOBJECT) {
    return accountHistoryConstants.FOLLOWED;
  }

  return '';
};

export const getMessageForSearchFilter = (currentUsername, actionType, actionDetails) => {
  switch (actionType) {
    case accountHistoryConstants.VOTE:
      return getVoteFilterType(actionDetails);
    case accountHistoryConstants.CUSTOM_JSON:
      return getCustomJSONFilterType(actionDetails);
    case accountHistoryConstants.COMMENT:
      return accountHistoryConstants.REPLIED;
    case accountHistoryConstants.AUTHOR_REWARD:
      return accountHistoryConstants.AUTHOR_REWARD;
    case accountHistoryConstants.CURATION_REWARD:
      return accountHistoryConstants.CURATION_REWARD;
    case accountHistoryConstants.CLAIM_REWARDS:
    case accountHistoryConstants.CLAIM_REWARD_BALANCE:
      return accountHistoryConstants.CLAIM_REWARDS;
    case accountHistoryConstants.TRANSFER_TO_VESTING:
      return accountHistoryConstants.POWERED_UP;
    case accountHistoryConstants.TRANSFER:
      if (actionDetails.to === currentUsername) {
        return accountHistoryConstants.RECEIVED;
      }

      return accountHistoryConstants.TRANSFERRED;
    default:
      return actionType;
  }
};

export const stringMatchesFilters = (string, filters = []) => {
  let filterMatches = false;

  for (let i = 0; i < filters.length; i += 1) {
    const currentFilter = filters[i];

    if (includes(string, currentFilter)) {
      filterMatches = true;
      break;
    }
  }

  return filterMatches;
};

export const actionsFilter = (action, accountHistoryFilter, currentUsername) => {
  const actionType = action.op[0];
  const actionDetails = action.op[1];
  const activitySearchIsEmpty = isEmpty(accountHistoryFilter);

  if (activitySearchIsEmpty) {
    return true;
  }

  const messageForActionType = getMessageForSearchFilter(
    currentUsername,
    actionType,
    actionDetails,
  );

  return stringMatchesFilters(messageForActionType, accountHistoryFilter);
};

export const getTimeFromLastAction = (username, accountHistory) => {
  const actionsHistory = get(accountHistory, username, []);
  const actions = [];

  actionsHistory.map(action => {
    const type = action.op[0];

    switch (type) {
      case accountHistoryConstants.ACCOUNT_CREATE:
      case accountHistoryConstants.ACCOUNT_CREATE_WITH_DELEGATION:
      case accountHistoryConstants.VOTE:
      case accountHistoryConstants.ACCOUNT_UPDATE:
      case accountHistoryConstants.COMMENT:
      case accountHistoryConstants.DELETE_COMMENT:
      case accountHistoryConstants.CUSTOM_JSON:
      case accountHistoryConstants.FOLLOW:
      case accountHistoryConstants.FOLLOW_WOBJECT:
      case accountHistoryConstants.REBLOG:
      case accountHistoryConstants.CURATION_REWARD:
      case accountHistoryConstants.AUTHOR_REWARD:
      case accountHistoryConstants.ACCOUNT_WITNESS_VOTE:
      case accountHistoryConstants.FILL_VESTING_WITHDRAW:
        return actions.push(action);
      default:
        return '';
    }
  });
  const lastActionElement = first(actions);

  return get(lastActionElement, 'timestamp', null);
};
