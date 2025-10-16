import base58 from 'bs58';
import getSlug from 'speakingurl';
import secureRandom from 'secure-random';
import diff_match_patch from 'diff-match-patch';
import * as steem from 'steem';
import { get, size } from 'lodash';
import { Client } from '@hiveio/dhive';

import formatter from '../../common/helpers/steemitFormatter';
import { BXY_GUEST_PREFIX, GUEST_PREFIX } from '../../common/constants/waivio';
import { getDownvotes } from '../../common/helpers/voteHelpers';
import {
  calculateVoteValueForSlider,
  checkExistPermlink,
  getContent,
} from '../../waivioApi/ApiClient';
import { generateRandomString } from '../../common/helpers/wObjectHelper';

const MAX_VOTING_POWER = 10000;
const VOTE_REGENERATION_DAYS = 5;
const DOWNVOTE_REGENERATION_DAYS = 5;

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
    permlink = permlink?.substring(permlink.length - 255, permlink.length);
  }
  // only letters numbers and dashes shall survive
  permlink = permlink.toLowerCase().replace(/[^a-z0-9-]+/g, '');
  return permlink;
};

/**
 * https://github.com/steemit/steemit.com/blob/47fd0e0846bd8c7c941ee4f95d5f971d3dc3981d/app/utils/ParsersAndFormatters.js
 */
export function parsePayoutAmount(amount) {
  return parseFloat(String(amount).replace(/\s[A-Z]*$/, '')) || 0;
}

/**
 * Calculates Payout Details Modified as needed
 * https://github.com/steemit/steemit.com/blob/47fd0e0846bd8c7c941ee4f95d5f971d3dc3981d/app/components/elements/Voting.jsx
 */
export const calculatePayout = (post, rates, isUpdates) => {
  if (!post) return {};
  const payoutDetails = {};
  const sponsorLikePayout = get(
    post.active_votes?.find(vote => vote.sponsor),
    'payout',
    0,
  );
  const waivPayout = post?.total_rewards_WAIV
    ? get(post, 'total_rewards_WAIV', 0) * rates
    : get(post, 'total_payout_WAIV', 0) * rates;
  const waivPayoutHalf = waivPayout / 2;
  const max_payout = parsePayoutAmount(post.max_accepted_payout);
  const pending_payout = parsePayoutAmount(post.pending_payout_value);
  const promoted = parsePayoutAmount(post.promoted);
  const total_author_payout = parsePayoutAmount(post.total_payout_value);
  const total_curator_payout = parsePayoutAmount(post.curator_payout_value);
  const total_payout_value = parsePayoutAmount(post.total_payout_value);
  // let payout = pending_payout + total_author_payout + total_curator_payout + waivPayout;
  let payout =
    post.payout || pending_payout + total_author_payout + total_curator_payout + waivPayout;
  const hivePayout = total_author_payout + total_curator_payout + pending_payout;
  const hivePayoutHalf = (hivePayout - sponsorLikePayout) / 2;
  const hbdPercent = post.percent_hbd ? 0.25 : 0;

  if (payout < 0) payout = 0.0;
  if (payout > max_payout) payout = max_payout;

  payoutDetails.payoutLimitHit = payout >= max_payout;
  payoutDetails.totalPayout = payout;
  payoutDetails.potentialPayout = pending_payout + waivPayout;
  payoutDetails.HBDPayout = hivePayout * hbdPercent;
  payoutDetails.WAIVPayout = waivPayout;
  payoutDetails.HIVEPayout = hivePayout - payoutDetails.HBDPayout;
  payoutDetails.authorPayouts = hivePayoutHalf + waivPayoutHalf + sponsorLikePayout;
  payoutDetails.curatorPayouts = hivePayoutHalf + waivPayoutHalf;

  if (!isPostCashout(post)) {
    payoutDetails.cashoutInTime = (post.cashout_time || post.payout_at) + '.000Z';
  } else {
    payoutDetails.HIVEPayout = total_payout_value;
    payoutDetails.pastPayouts = payout;
    payoutDetails.authorPayouts = total_author_payout + waivPayoutHalf;
    payoutDetails.curatorPayouts = total_curator_payout + waivPayoutHalf;
  }

  if (promoted > 0) {
    payoutDetails.promotionCost = promoted;
  }

  if (max_payout === 0 && !isUpdates) {
    payoutDetails.isPayoutDeclined = true;
  } else if (max_payout < 1000000) {
    payoutDetails.maxAcceptedPayout = max_payout;
  }

  return payoutDetails;
};

export const isPostCashout = post =>
  post?.cashout_time
    ? Date.parse(`${get(post, 'cashout_time')}.000Z`) < Date.now()
    : Date.parse(`${get(post, 'payout_at')}.000Z`) < Date.now();

export const isFlaggedPost = (votes, name) =>
  getDownvotes(votes).some(({ voter }) => voter === name);

export const calculateVotePowerForSlider = async (name, weight, author, permlink) => {
  const res = await calculateVoteValueForSlider(name, { author, permlink, weight });

  return res.result;
};

function checkPermLinkLength(permlink) {
  const length = size(permlink);
  if (length > 255) {
    // STEEMIT_MAX_PERMLINK_LENGTH
    permlink = permlink?.substring(length - 255, length);
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

export function createPermlink(title, author, parent_author, parent_permlink, locale, follower) {
  let permlink;
  if (title && title.trim() !== '') {
    let s = slug(title);
    if (s === '') {
      s = base58.encode(secureRandom.randomBuffer(4));
    }
    if (author?.startsWith(GUEST_PREFIX) || author?.startsWith(BXY_GUEST_PREFIX)) {
      const prefix = `${base58.encode(secureRandom.randomBuffer(4))}-`;
      permlink = prefix + s;
      return Promise.resolve(checkPermLinkLength(permlink));
    }
    return getContent(author, s, locale, follower)
      .then(content => {
        let prefix = '';

        if (content.body) {
          // make sure slug is unique
          prefix = `${base58.encode(secureRandom.randomBuffer(4))}-`;
        }

        permlink = prefix + s;

        return checkPermLinkLength(permlink);
      })
      .catch(() => {
        permlink = s;
        return checkPermLinkLength(permlink);
      });
  }
  // comments: re-parentauthor-parentpermlink-time
  const timeStr = new Date().toISOString().replace(/[^a-zA-Z0-9]+/g, '');
  parent_permlink = parent_permlink.replace(/(-\d{8}t\d{9}z)/g, '');
  permlink = `re-${parent_author}-${parent_permlink}-${timeStr}`;
  return Promise.resolve(checkPermLinkLength(permlink));
}

const addPrefixForPermlink = async s => {
  const prefix = `${base58.encode(secureRandom.randomBuffer(4))}-`;
  const permlink = prefix + s;
  const checkWithPrefix = await checkExistPermlink(permlink);

  if (!checkWithPrefix.exist) {
    return Promise.resolve(checkPermLinkLength(permlink));
  } else {
    return addPrefixForPermlink(s);
  }
};

export const getObjectPermlink = async title => {
  let permlink = slug(title);
  if (permlink === '') permlink = base58.encode(secureRandom.randomBuffer(4));

  const checkWithoutPrefix = await checkExistPermlink(permlink);

  if (!checkWithoutPrefix.exist) {
    return Promise.resolve(
      `${generateRandomString(3).toLowerCase()}-${checkPermLinkLength(permlink).toLowerCase()}`,
    );
  }

  return addPrefixForPermlink(permlink);
};

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
    const downvotePer = downvoteMana / (currentMana / user.voting_mana / 4);
    const secondsago = (new Date() - new Date(downvoteUpdate * 1000)) / 1000;
    const pow = Math.min((downvotePer * 100 + (10000 * secondsago) / 432000) / 100, 100);

    return pow % 10 ? pow.toFixed(2) : pow.toFixed(0);
  }

  return 100;
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

export const calculateEstAccountValue = (
  user,
  totalVestingShares,
  totalVestingFundSteem,
  steemRate,
  sbdRate,
) => {
  const steemPower = formatter.vestToSteem(
    parseFloat(user.vesting_shares) || 0,
    totalVestingShares,
    totalVestingFundSteem,
  );
  const finalSteemPower = isNaN(steemPower) ? 0 : steemPower;
  const balance = parseFloat(user.balance) || 0;
  const hbdBalance = parseFloat(user.hbd_balance) || 0;
  const validSteemRate = parseFloat(steemRate) || 0;
  const validSbdRate = parseFloat(sbdRate) || 0;

  return validSteemRate * (balance + finalSteemPower) + hbdBalance * validSbdRate;
};

export const roundNumberToThousands = number => {
  if (number >= 1000 && number < 1000000) {
    const fixedNumber = (number / 1000).toFixed(1);
    number = `${
      fixedNumber?.charAt(fixedNumber.length - 1) === '0'
        ? fixedNumber.slice(0, fixedNumber.length - 2)
        : fixedNumber
    } K`;
  } else if (number >= 1000000) {
    const fixedBillNumber = (number / 1000000).toFixed(2);
    number = `${
      fixedBillNumber?.charAt(fixedBillNumber.length - 1) === '0'
        ? fixedBillNumber.slice(0, fixedBillNumber.length - 3)
        : fixedBillNumber
    } M`;
  }
  return number;
};
// const isDev = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'staging';

const PRODUCTION_REQUEST_NODES = [
  'https://api.hive.blog',
  'https://api.deathwing.me',
  'https://hive-api.arcange.eu',
  'https://api.openhive.network',
  'https://techcoderx.com',
  'https://api.c0ff33a.uk',
];

export const dHive = new Client(PRODUCTION_REQUEST_NODES, {
  timeout: 5000,
  failoverThreshold: 0,
});

export const getLastBlockNum = async () => {
  const { head_block_number } = await dHive.database.getDynamicGlobalProperties();
  return head_block_number + 2;
};

export const calcReputation = rep => steem.formatter.reputation(rep);

export const calculateMana = votingPower => {
  const timestamp = new Date().getTime();
  const result = {
    votingPower: votingPower.votingPower,
    downvotingPower: votingPower.downvotingPower,
    lastVoteTimestamp: votingPower.lastVoteTimestamp,
  };

  result.votingPower +=
    ((timestamp - result.lastVoteTimestamp) * MAX_VOTING_POWER) /
    (VOTE_REGENERATION_DAYS * 24 * 3600 * 1000);
  result.votingPower = Math.floor(result.votingPower);
  result.votingPower = Math.min(result.votingPower, MAX_VOTING_POWER) * 0.01;

  result.downvotingPower +=
    ((timestamp - result.lastVoteTimestamp) * MAX_VOTING_POWER) /
    (DOWNVOTE_REGENERATION_DAYS * 24 * 3600 * 1000);
  result.downvotingPower = Math.floor(result.downvotingPower);
  result.downvotingPower = Math.min(result.downvotingPower, MAX_VOTING_POWER) * 0.01;
  return result;
};
