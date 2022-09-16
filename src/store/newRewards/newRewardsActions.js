import { round } from 'lodash';

import { generatePermlink, getObjectName } from '../../common/helpers/wObjectHelper';
import { getNewDetailsBody } from '../../client/rewards/rewardsHelper';
import config from '../../waivioApi/config.json';
import { subscribeTypes } from '../../common/constants/blockTypes';
import { getAuthenticatedUserName } from '../authStore/authSelectors';
import { changeRewardsTab } from '../authStore/authActions';
import { getTokenRatesInUSD } from '../walletStore/walletSelectors';
import { rewardsPost } from '../../client/rewards/Manage/constants';
import { createCommentPermlink, getBodyPatchIfSmaller } from '../../client/vendor/steemitHelpers';
import { SET_PENDING_UPDATE } from '../userStore/userActions';
import { notify } from '../../client/app/Notification/notificationActions';
import { createPostMetadata } from '../../common/helpers/postHelpers';
import { jsonParse } from '../../common/helpers/formatter';

export const reserveProposition = (proposition, username, history) => async (
  dispatch,
  getState,
  { busyAPI, steemConnectAPI },
) => {
  const permlink = `reserve-${generatePermlink()}`;
  const dish = proposition?.object;
  const proposedWobjName = getObjectName(dish);
  const proposedAuthorPermlink = dish?.author_permlink;
  const primaryObject = proposition?.requiredObject;
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

export const rejectAuthorReview = proposition => (
  dispatch,
  getState,
  { steemConnectAPI, busyAPI },
) => {
  const commentOp = [
    'comment',
    {
      parent_author: proposition.userName,
      parent_permlink: proposition.reservationPermlink,
      author: proposition.guideName,
      permlink: createCommentPermlink(proposition.userName, proposition.reservationPermlink),
      title: 'Cancelled reservation',
      body: `User <a href="https://www.waivio.com/@${proposition.guideName}">${
        proposition.guideName
      }</a> cancelled reservation for <a href="https://www.waivio.com${
        proposition?.object?.defaultShowLink
      }">${getObjectName(proposition?.object)}</a> rewards campaign`,
      json_metadata: JSON.stringify({
        waivioRewards: {
          type: 'rejectReservationByGuide',
        },
      }),
    },
  ];

  return new Promise((resolve, reject) => {
    steemConnectAPI
      .broadcast([commentOp])
      .then(res => {
        busyAPI.instance.sendAsync(subscribeTypes.subscribeTransactionId, [
          proposition.guideName,
          res.result.id,
        ]);
        busyAPI.instance.subscribe((datad, j) => {
          if (j?.success && j?.permlink === res.result.id) {
            resolve();
          }
        });
      })
      .then(() =>
        dispatch({
          type: SET_PENDING_UPDATE.START,
        }),
      )
      .catch(error => reject(error));
  });
};

export const deactivateCampaing = (item, guideName) => (
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

  return new Promise(resolve =>
    steemConnectAPI.broadcast([commentOp]).then(() => {
      busyAPI.instance.sendAsync(subscribeTypes.subscribeCampaignDeactivation, [
        authUserName,
        deactivationPermlink,
      ]);
      busyAPI.instance.subscribe((datad, j) => {
        if (j?.success && j?.permlink === deactivationPermlink) {
          resolve();
        }
      });
    }),
  );
};

export const setMatchBotVotingPower = votingPower => (dispatch, getState, { steemConnectAPI }) => {
  const state = getState();
  const username = getAuthenticatedUserName(state);

  return steemConnectAPI.settingNewMatchBotVotingPower(username, votingPower);
};

export const removeMatchBotRule = sponsorName => (
  dispatch,
  getState,
  { steemConnectAPI, busyAPI },
) => {
  const state = getState();
  const username = getAuthenticatedUserName(state);

  return new Promise(resolve => {
    steemConnectAPI.removeMatchBotRule(username, sponsorName).then(({ result }) => {
      busyAPI.instance.sendAsync(subscribeTypes.subscribeTransactionId, [username, result.id]);
      busyAPI.instance.subscribe((datad, j) => {
        if (j?.success && j?.permlink === result.id) {
          resolve();
        }
      });
    });
  });
};

export const setNewMatchBotRules = ruleObj => (
  dispatch,
  getState,
  { steemConnectAPI, busyAPI },
) => {
  const state = getState();
  const username = getAuthenticatedUserName(state);

  return new Promise(resolve =>
    steemConnectAPI.setMatchBotNewRule(username, ruleObj).then(({ result }) => {
      busyAPI.instance.sendAsync(subscribeTypes.subscribeTransactionId, [username, result.id]);
      busyAPI.instance.subscribe((datad, j) => {
        if (j?.success && j?.permlink === result.id) {
          resolve();
        }
      });
    }),
  );
};

export const sendCommentForReward = (proposition, body, isUpdating = false, originalComment) => (
  dispatch,
  getState,
  { steemConnectAPI },
) => {
  const { auth } = getState();

  if (!auth.isAuthenticated) {
    return dispatch(notify('You have to be logged in to comment', 'error'));
  }

  if (!body || !body.length) {
    return dispatch(notify("Message can't be empty", 'error'));
  }

  const author = isUpdating ? originalComment.author : auth.user.name;

  const permlink = isUpdating
    ? originalComment.permlink
    : createCommentPermlink(proposition?.userName, proposition?.reservationPermlink);

  const currCategory = [];

  const jsonMetadata = createPostMetadata(
    body,
    currCategory,
    isUpdating && jsonParse(originalComment.json_metadata),
  );

  const newBody =
    isUpdating && !auth.isGuestUser ? getBodyPatchIfSmaller(originalComment.body, body) : body;

  return steemConnectAPI
    .comment(
      auth.user.name,
      proposition?.reservationPermlink,
      author,
      permlink,
      '',
      newBody,
      jsonMetadata,
      proposition.userName,
    )
    .catch(err => {
      dispatch(notify(err.error.message || err.error_description, 'error'));
    });
};

export default null;
