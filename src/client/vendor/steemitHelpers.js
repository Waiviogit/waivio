import base58 from 'bs58';
import getSlug from 'speakingurl';
import secureRandom from 'secure-random';
import diff_match_patch from 'diff-match-patch';
import * as steem from 'steem';
import { get, size } from 'lodash';
import { Client } from '@hiveio/dhive';

import steemAPI from '../steemAPI';
import formatter from '../helpers/steemitFormatter';
import { BXY_GUEST_PREFIX, GUEST_PREFIX } from '../../common/constants/waivio';

const dmp = new diff_match_patch();
/**
 * This function is extracted from steemit.com source code and does the same tasks with some slight-
 * adjustments to meet our needs. Refer to the main one in case of future problems:
 * https://github.com/steemit/steemit.com/blob/edac65e307bffc23f763ed91cebcb4499223b356/app/redux/TransactionSaga.js#L340
 *
 */
export const createCommentPermlink = (parentAuthor, parentPermlink) => {
  let permlink;

  // comments: re-parentauthor-parentpermlink-time
  const timeStr = new Date().toISOString().replace(/[^a-zA-Z0-9]+/g, '');
  const newParentPermlink = parentPermlink.replace(/(-\d{8}t\d{9}z)/g, '');
  permlink = `re-${parentAuthor}-${newParentPermlink}-${timeStr}`;

  if (permlink.length > 255) {
    // STEEMIT_MAX_PERMLINK_LENGTH
    permlink = permlink.substring(permlink.length - 255, permlink.length);
  }
  // only letters numbers and dashes shall survive
  permlink = permlink.toLowerCase().replace(/[^a-z0-9-]+/g, '');
  return permlink;
};

/**
 * https://github.com/steemit/steemit.com/blob/47fd0e0846bd8c7c941ee4f95d5f971d3dc3981d/app/utils/ParsersAndFormatters.js
 */
export function parsePayoutAmount(amount) {
  return parseFloat(String(amount).replace(/\s[A-Z]*$/, ''));
}

/**
 * Calculates Payout Details Modified as needed
 * https://github.com/steemit/steemit.com/blob/47fd0e0846bd8c7c941ee4f95d5f971d3dc3981d/app/components/elements/Voting.jsx
 */
export const calculatePayout = post => {
  const payoutDetails = {};
  const { cashout_time } = post;

  const max_payout = parsePayoutAmount(post.max_accepted_payout);
  const pending_payout = parsePayoutAmount(post.pending_payout_value);
  const promoted = parsePayoutAmount(post.promoted);
  const total_author_payout = parsePayoutAmount(post.total_payout_value);
  const total_curator_payout = parsePayoutAmount(post.curator_payout_value);
  let payout = pending_payout + total_author_payout + total_curator_payout;
  if (payout < 0.0) payout = 0.0;
  if (payout > max_payout) payout = max_payout;

  payoutDetails.payoutLimitHit = payout >= max_payout;
  payoutDetails.totalPayout = payout;

  if (!isPostCashout(post)) {
    payoutDetails.cashoutInTime = cashout_time + '.000Z';
    payoutDetails.potentialPayout = pending_payout;
  }

  if (promoted > 0) {
    payoutDetails.promotionCost = promoted;
  }

  if (max_payout === 0) {
    payoutDetails.isPayoutDeclined = true;
  } else if (max_payout < 1000000) {
    payoutDetails.maxAcceptedPayout = max_payout;
  }

  if (payout > 0) {
    payoutDetails.pastPayouts = total_author_payout + total_curator_payout;
    payoutDetails.authorPayouts = total_author_payout;
    payoutDetails.curatorPayouts = total_curator_payout;
  }

  return payoutDetails;
};

export const isPostCashout = post => Date.parse(post.cashout_time) < Date.now();

export const calculateVotePowerForSlider = async (name, voteWeight, author, permlink) => {
  const account = (await steemAPI.sendAsync('get_accounts', [[name]]))[0];
  const sbdMedian = await steemAPI.sendAsync('get_current_median_history_price', []);
  const rewardFund = await steemAPI.sendAsync('get_reward_fund', ['post']);
  const post = await steemAPI.sendAsync('get_content', [author, permlink]);
  const price = parseFloat(sbdMedian.base) / parseFloat(sbdMedian.quote);
  const vests =
    parseFloat(account.vesting_shares) +
    parseFloat(account.received_vesting_shares) -
    parseFloat(account.delegated_vesting_shares);

  const previousVoteTime =
    (new Date().getTime() - new Date(`${account.last_vote_time}Z`).getTime()) / 1000;
  const accountVotingPower = Math.min(
    10000,
    account.voting_power + (10000 * previousVoteTime) / 432000,
  );

  const power = Math.round(((accountVotingPower / 100) * voteWeight) / 50);
  const rShares = vests * power * 100 - 50000000;
  const tRShares = parseFloat(post.vote_rshares) + rShares;

  const s = parseFloat(rewardFund.content_constant);
  const tClaims = (tRShares * (tRShares + 2 * s)) / (tRShares + 4 * s);

  const rewards = parseFloat(rewardFund.reward_balance) / parseFloat(rewardFund.recent_claims);
  const postValue = tClaims * rewards * price;
  const voteValue = postValue * (rShares / tRShares);

  return voteValue >= 0 ? voteValue : 0;
};

function checkPermLinkLength(permlink) {
  const length = size(permlink);
  if (length > 255) {
    // STEEMIT_MAX_PERMLINK_LENGTH
    permlink = permlink.substring(length - 255, length);
  }
  // only letters numbers and dashes shall survive
  permlink = permlink.toLowerCase().replace(/[^a-z0-9-]+/g, '');
  return permlink;
}

function slug(text) {
  return getSlug(text.replace(/[<>]/g, ''), { truncate: 128 });
}

/**
 * Generate permlink
 * https://github.com/steemit/steemit.com/blob/ded8ecfcc9caf2d73b6ef12dbd0191bd9dbf990b/app/redux/TransactionSaga.js
 */

export function createPermlink(title, author, parent_author, parent_permlink) {
  let permlink;
  if (title && title.trim() !== '') {
    let s = slug(title);
    if (s === '') {
      s = base58.encode(secureRandom.randomBuffer(4));
    }
    if (author.startsWith(GUEST_PREFIX) || author.startsWith(BXY_GUEST_PREFIX)) {
      const prefix = `${base58.encode(secureRandom.randomBuffer(4))}-`;
      permlink = prefix + s;
      return Promise.resolve(checkPermLinkLength(permlink));
    }

    return steemAPI
      .sendAsync('get_content', [author, s])
      .then(content => {
        let prefix;
        if (content.body !== '') {
          // make sure slug is unique
          prefix = `${base58.encode(secureRandom.randomBuffer(4))}-`;
        } else {
          prefix = '';
        }
        permlink = prefix + s;
        return checkPermLinkLength(permlink);
      })
      .catch(() => {
        const prefix = `${base58.encode(secureRandom.randomBuffer(4))}-`;
        permlink = s + prefix;
        return checkPermLinkLength(permlink);
      });
  }
  // comments: re-parentauthor-parentpermlink-time
  const timeStr = new Date().toISOString().replace(/[^a-zA-Z0-9]+/g, '');
  parent_permlink = parent_permlink.replace(/(-\d{8}t\d{9}z)/g, '');
  permlink = `re-${parent_author}-${parent_permlink}-${timeStr}`;
  return Promise.resolve(checkPermLinkLength(permlink));
}

/**
 * https://github.com/steemit/steemit.com/blob/ded8ecfcc9caf2d73b6ef12dbd0191bd9dbf990b/app/redux/TransactionSaga.js#L412
 */
function createPatch(text1, text2) {
  if (!text1 && text1 === '') return undefined;
  const patches = dmp.patch_make(text1, text2);

  return dmp.patch_toText(patches);
}

/**
 * https://github.com/steemit/steemit.com/blob/ded8ecfcc9caf2d73b6ef12dbd0191bd9dbf990b/app/redux/TransactionSaga.js#L329
 */
export function getBodyPatchIfSmaller(originalBody, body) {
  if (!originalBody) return body;
  const patch = createPatch(originalBody, body);
  // Putting body into buffer will expand Unicode characters into their true length
  if (patch && patch.length < new Buffer(body, 'utf-8').length) {
    body = patch;
  }
  return body;
}

/**
 * https://github.com/aaroncox/chainbb/blob/fcb09bee716e907c789a6494975093361482fb4f/services/frontend/src/components/elements/post/button/vote/options.js#L69
 */
export const calculateVoteValue = (
  vests,
  recentClaims,
  rewardBalance,
  rate,
  vp = 10000,
  weight = 10000,
) => {
  const vestingShares = parseInt(vests * 1e6, 10);
  const power = (vp * weight) / 10000 / 50;
  const rshares = (power * vestingShares) / 10000;
  return (rshares / recentClaims) * rewardBalance * rate;
};

export const calculateDownVote = user => {
  const currentMana = get(user, ['voting_manabar', 'current_mana']);
  const downvoteMana = get(user, ['downvote_manabar', 'current_mana']);

  if (currentMana && downvoteMana) {
    const downvoteUpdate = user.downvote_manabar.last_update_time;
    const downvotePer = downvoteMana / (currentMana / (user.voting_power / 100) / 4);
    const secondsago = (new Date() - new Date(downvoteUpdate * 1000)) / 1000;
    const pow = Math.min((downvotePer * 100 + (10000 * secondsago) / 432000) / 100, 100);

    return pow % 10 ? pow.toFixed(2) : pow.toFixed(0);
  }

  return 0;
};

export const calculateTotalDelegatedSP = (user, totalVestingShares, totalVestingFundSteem) => {
  const receivedSP = parseFloat(
    formatter.vestToSteem(user.received_vesting_shares, totalVestingShares, totalVestingFundSteem),
  );
  const delegatedSP = parseFloat(
    formatter.vestToSteem(user.delegated_vesting_shares, totalVestingShares, totalVestingFundSteem),
  );
  return receivedSP - delegatedSP;
};

export const calculatePendingWithdrawalSP = (user, totalVestingShares, totalVestingFundSteem) => {
  return parseFloat(
    formatter.vestToSteem(
      Math.min(
        parseFloat(user.vesting_withdraw_rate),
        (parseFloat(user.to_withdraw) - parseFloat(user.withdrawn)) / 100000,
      ),
      totalVestingShares,
      totalVestingFundSteem,
    ),
  );
};

export const calculateVotingPower = user => {
  if (user.last_vote_time && user.voting_power) {
    const secondsago =
      (new Date().getTime() - new Date(user.last_vote_time + 'Z').getTime()) / 1000;
    return Math.min(10000, user.voting_power + (10000 * secondsago) / 432000) / 10000;
  }
  return 0;
};

export const calculateEstAccountValue = (
  user,
  totalVestingShares,
  totalVestingFundSteem,
  steemRate,
  sbdRate,
) => {
  const steemPower = formatter.vestToSteem(
    user.vesting_shares,
    totalVestingShares,
    totalVestingFundSteem,
  );
  return (
    parseFloat(steemRate) * (parseFloat(user.balance) + parseFloat(steemPower)) +
    parseFloat(user.hbd_balance) * parseFloat(sbdRate)
  );
};

export const roundNumberToThousands = number => {
  if (number >= 1000 && number < 1000000) {
    const fixedNumber = (number / 1000).toFixed(1);
    number = `${
      fixedNumber.charAt(fixedNumber.length - 1) === '0'
        ? fixedNumber.slice(0, fixedNumber.length - 2)
        : fixedNumber
    } K`;
  } else if (number >= 1000000) {
    const fixedBillNumber = (number / 1000000).toFixed(2);
    number = `${
      fixedBillNumber.charAt(fixedBillNumber.length - 1) === '0'
        ? fixedBillNumber.slice(0, fixedBillNumber.length - 3)
        : fixedBillNumber
    }'B'`;
  }
  return number;
};

export const dHive = new Client(['https://anyx.io/'], {
  timeout: 8 * 1000,
  failoverThreshold: 4,
  rebrandedApi: true,
});

export const calcReputation = rep => steem.formatter.reputation(rep);
