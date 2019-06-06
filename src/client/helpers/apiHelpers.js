import SteemAPI from '../steemAPI';
import { getFeedContentByObject, getMoreFeedContentByObject } from '../../waivioApi/ApiClient';
import { jsonParse } from '../helpers/formatter';
import * as accountHistoryConstants from '../../common/constants/accountHistory';

export function getDiscussionsFromAPI(sortBy, query, ApiClient) {
  switch (sortBy) {
    case 'feed':
    case 'hot':
    case 'created':
    case 'active':
    case 'trending':
    case 'blog':
    case 'comments':
    case 'promoted':
      return ApiClient.getFeedContent(sortBy, query);
    case 'wia_feed':
      // return getWobjectsFeed(query.limit, query.skip || 0);
      if (query.skip && query.skip > 0) {
        return getMoreFeedContentByObject({
          authorPermlink: 'vmf-wtrade',
          skip: query.skip || 0,
          limit: query.limit || 10,
        });
      }
      return getFeedContentByObject('vmf-wtrade');
    default:
      return new Promise((resolve, reject) => {
        reject(new Error('There is not API endpoint defined for this sorting'));
      });
  }
}

export const getAccount = username =>
  SteemAPI.sendAsync('get_accounts', [[username]]).then(result => {
    if (result.length) {
      const userAccount = result[0];
      userAccount.json_metadata = jsonParse(result[0].json_metadata);
      return userAccount;
    }
    throw new Error('User Not Found');
  });

export const getFollowingCount = username =>
  SteemAPI.sendAsync('call', ['follow_api', 'get_follow_count', [username]]);

export const getAccountWithFollowingCount = username =>
  Promise.all([getAccount(username), getFollowingCount(username)]).then(([account, following]) => ({
    ...account,
    following_count: following.following_count,
    follower_count: following.follower_count,
  }));

export const getFollowing = (username, startForm = '', type = 'blog', limit = 100) =>
  SteemAPI.sendAsync('call', [
    'follow_api',
    'get_following',
    [username, startForm, type, limit],
  ]).then(result => result.map(user => user.following));

export const getFollowers = (username, startForm = '', type = 'blog', limit = 100) =>
  SteemAPI.sendAsync('call', [
    'follow_api',
    'get_followers',
    [username, startForm, type, limit],
  ]).then(result => result.map(user => ({ name: user.follower })));

export const getAllFollowing = username =>
  new Promise(async resolve => {
    const following = await getFollowingCount(username);
    const chunkSize = 100;
    const limitArray = Array.fill(
      Array(Math.ceil(following.following_count / chunkSize)),
      chunkSize,
    );
    const list = limitArray.reduce(async (currentListP, value) => {
      const currentList = await currentListP;
      const startForm = currentList[currentList.length - 1] || '';
      const followers = await getFollowing(username, startForm, 'blog', value);
      return currentList.slice(0, currentList.length - 1).concat(followers);
    }, []);
    resolve(list);
  });

export const defaultAccountLimit = 500;

export const getAccountHistory = (account, from = -1, limit = defaultAccountLimit) =>
  SteemAPI.sendAsync('get_account_history', [account, from, limit]);

export const getDynamicGlobalProperties = () =>
  SteemAPI.sendAsync('get_dynamic_global_properties', []);

export const isWalletTransaction = actionType =>
  actionType === accountHistoryConstants.TRANSFER ||
  actionType === accountHistoryConstants.TRANSFER_TO_VESTING ||
  actionType === accountHistoryConstants.CANCEL_TRANSFER_FROM_SAVINGS ||
  actionType === accountHistoryConstants.TRANSFER_FROM_SAVINGS ||
  actionType === accountHistoryConstants.TRANSFER_TO_SAVINGS ||
  actionType === accountHistoryConstants.DELEGATE_VESTING_SHARES ||
  actionType === accountHistoryConstants.CLAIM_REWARD_BALANCE;

export const getAccountReputation = (name, limit = 20) =>
  SteemAPI.sendAsync('call', ['reputation_api', 'get_account_reputations', [name, limit]]);

export const getAllSearchResultPages = search => {
  const promises = [];

  for (let i = 0; i <= 10; i += 1) {
    promises.push(
      fetch(`https://api.asksteem.com/search?q=${search}&types=post&pg=${i}`).then(res =>
        res.json(),
      ),
    );
  }

  return Promise.all(promises);
};

export const currentUserFollowersUser = (currentUsername, username) =>
  SteemAPI.sendAsync('call', [
    'follow_api',
    'get_following',
    [username, currentUsername, 'blog', 1],
  ]);
