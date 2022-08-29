import { round } from 'lodash';

import { generatePermlink, getObjectName } from '../../common/helpers/wObjectHelper';
import { getNewDetailsBody } from '../../client/rewards/rewardsHelper';
import config from '../../waivioApi/config.json';
import { subscribeTypes } from '../../common/constants/blockTypes';
import { getAuthenticatedUserName } from '../authStore/authSelectors';
import { changeRewardsTab } from '../authStore/authActions';
import { getTokenRatesInUSD } from '../walletStore/walletSelectors';
import { rewardsPost } from '../../client/rewards/Manage/constants';

export const reserveProposition = (proposition, username, history) => async (
  dispatch,
  getState,
  { busyAPI, steemConnectAPI },
) => {
  const permlink = `reserve-${generatePermlink()}`;
  const dish = proposition?.object;
  const proposedWobjName = getObjectName(dish);
  const proposedAuthorPermlink = dish?.author_permlink;
  const primaryObject = proposition?.object?.parent;
  const rates = getTokenRatesInUSD(getState(), 'WAIV');
  const amount = round(proposition.rewardInUSD / rates, 3);
  const detailsBody = await getNewDetailsBody(proposition);
  const commentOp = [
    'comment',
    {
      parent_author: proposition.guideName,
      parent_permlink: proposition.activationPermlink,
      author: username,
      permlink,
      title: 'Rewards reservations',
      body: `<p>User ${username} (@${username}) has reserved the rewards of ${amount} ${
        proposition.payoutToken
      } for a period of ${proposition.countReservationDays} days to write a review of <a href='${
        dish.defaultShowLink
      }'>${proposedWobjName}</a>, <a href='${primaryObject.defaultShowLink}'>${getObjectName(
        primaryObject,
      )}</a>.</p>${detailsBody}`,
      json_metadata: JSON.stringify({
        app: config.appName,
        waivioRewards: {
          type: 'reserveCampaign',
          requiredObject: proposedAuthorPermlink,
        },
      }),
    },
  ];

  return new Promise((resolve, reject) => {
    steemConnectAPI
      .broadcast([commentOp])
      .then(async () => {
        busyAPI.instance.sendAsync(subscribeTypes.subscribeCampaignAssign, [username, permlink]);
        busyAPI.instance.subscribe((datad, j) => {
          if (j?.success && j?.permlink === permlink) {
            dispatch(changeRewardsTab(username));
            history.push('/rewards-new/reserved');
            resolve();
          }
        });
      })
      .catch(error => reject(error));
  });
};

export const realiseRewards = proposition => (dispatch, getState, { steemConnectAPI, busyAPI }) => {
  const unreservationPermlink = `reject-${proposition.object._id}${generatePermlink()}`;
  const username = getAuthenticatedUserName(getState());

  const commentOp = [
    'comment',
    {
      parent_author: proposition?.guideName,
      parent_permlink: proposition?.activationPermlink,
      author: username,
      permlink: unreservationPermlink,
      title: 'Cancelled reservation',
      body: `User <a href="https://www.waivio.com/@${username}">${username}</a> cancelled reservation for <a href="https://www.waivio.com${
        proposition?.object?.defaultShowLink
      }">${getObjectName(proposition?.object)}</a> rewards campaign`,
      json_metadata: JSON.stringify({
        waivioRewards: {
          type: 'rejectReservation',
          reservationPermlink: proposition?.reservationPermlink,
        },
      }),
    },
  ];

  return new Promise((resolve, reject) => {
    steemConnectAPI
      .broadcast([commentOp])
      .then(async () => {
        busyAPI.instance.sendAsync(subscribeTypes.subscribeCampaignRelease, [
          username,
          unreservationPermlink,
        ]);
        busyAPI.instance.subscribe((datad, j) => {
          if (j?.success && j?.permlink === unreservationPermlink) {
            dispatch(changeRewardsTab(username));
            resolve();
          }
        });
      })
      .catch(error => reject(error));
  });
};

export const deactivateCampaing = (item, guideName, callback) => (
  dispatch,
  getState,
  { steemConnectAPI, busyAPI },
) => {
  const authUserName = getAuthenticatedUserName(getState());
  const deactivationPermlink = `deactivate-${rewardsPost.parent_author.replace(
    '.',
    '-',
  )}-${generatePermlink()}`;
  const commentOp = [
    'comment',
    {
      parent_author: guideName,
      parent_permlink: item.activationPermlink,
      author: guideName,
      permlink: deactivationPermlink,
      title: 'Unactivate object for rewards',
      body: `Campaign ${item.name} was inactivated by ${guideName} `,
      json_metadata: JSON.stringify({
        waivioRewards: {
          type: 'stopCampaign',
          campaignId: item._id,
        },
      }),
    },
  ];

  steemConnectAPI.broadcast([commentOp]).then(() => {
    busyAPI.instance.sendAsync(subscribeTypes.subscribeCampaignDeactivation, [
      authUserName,
      deactivationPermlink,
    ]);
    busyAPI.instance.subscribe((datad, j) => {
      if (j?.success && j?.permlink === deactivationPermlink) {
        callback();
      }
    });
  });
};

export const setMatchBotVotingPower = votingPower => (dispatch, getState, { steemConnectAPI }) => {
  const state = getState();
  const username = getAuthenticatedUserName(state);

  return steemConnectAPI.settingNewMatchBotVotingPower(username, votingPower);
};

export const removeMatchBotRule = sponsorName => (dispatch, getState, { steemConnectAPI }) => {
  const state = getState();
  const username = getAuthenticatedUserName(state);

  return steemConnectAPI.removeMatchBotRule(username, sponsorName);
};

export const setNewMatchBotRules = ruleObj => (dispatch, getState, { steemConnectAPI }) => {
  const state = getState();
  const username = getAuthenticatedUserName(state);

  return steemConnectAPI.setMatchBotNewRule(username, ruleObj);
};

export default null;
