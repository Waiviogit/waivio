import { round, isArray } from 'lodash';
import { message } from 'antd';

import {
  generatePermlink,
  getObjectName,
  getObjectUrlForLink,
} from '../../common/helpers/wObjectHelper';
import { getNewDetailsBody } from '../../client/rewards/rewardsHelper';
import config from '../../waivioApi/config.json';
import { subscribeTypes } from '../../common/constants/blockTypes';
import { getAuthenticatedUserName, isGuestUser } from '../authStore/authSelectors';
import { changeRewardsTab } from '../authStore/authActions';
import { getTokenRatesInUSD } from '../walletStore/walletSelectors';
import { createCommentPermlink } from '../../client/vendor/steemitHelpers';
import { SET_PENDING_UPDATE } from '../userStore/userActions';
import { notify } from '../../client/app/Notification/notificationActions';
import { createPostMetadata } from '../../common/helpers/postHelpers';
import { jsonParse } from '../../common/helpers/formatter';
import { getSelectedDish, getSelectedRestaurant } from '../quickRewards/quickRewardsSelectors';
import { rewardsPost } from '../../client/newRewards/ManageCampaingsTab/constants';
import { createAsyncActionType } from '../../common/helpers/stateHelpers';
import { getAllRewardList, getEligibleRewardList } from '../../waivioApi/ApiClient';

export const reserveProposition = (proposition, username) => async (
  dispatch,
  getState,
  { busyAPI, steemConnectAPI },
) => {
  const permlink = `reserve-${generatePermlink()}`;
  const objects = isArray(proposition?.objects) ? proposition?.objects[0] : proposition?.objects;
  const dish = proposition?.object || { author_permlink: objects, defaultShowLink: objects };
  const proposedWobjName = getObjectName(dish);
  const proposedAuthorPermlink = dish?.author_permlink;
  const primaryObject =
    typeof proposition?.requiredObject === 'string'
      ? { author_permlink: objects }
      : proposition?.requiredObject;
  const state = getState();
  const isGuest = isGuestUser(state);
  const rates = getTokenRatesInUSD(state, 'WAIV');
  const amount = round(proposition.rewardInUSD / rates, 3);
  const detailsBody = await getNewDetailsBody(proposition, primaryObject);
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
        dish?.defaultShowLink
      }'>${proposedWobjName}</a>${
        primaryObject.author_permlink !== proposedAuthorPermlink
          ? `, <a href='${getObjectUrlForLink(primaryObject)}'>${getObjectName(primaryObject)}</a>`
          : ''
      }.</p>${detailsBody}`,
      json_metadata: JSON.stringify({
        app: config.appName,
        waivioRewards: {
          type: 'reserveCampaign',
          requiredObject: proposedAuthorPermlink,
          payoutTokenRateUSD: rates,
        },
      }),
    },
  ];

  return new Promise((resolve, reject) => {
    steemConnectAPI
      .broadcast([commentOp])
      .then(async res => {
        if (res.error) reject();

        if (isGuest) {
          setTimeout(() => {
            dispatch(changeRewardsTab(username));
            resolve();
          }, 7000);
        } else {
          const timeoutId = setTimeout(() => {
            dispatch(changeRewardsTab(username));
            resolve();
          }, 10000);

          busyAPI.instance.sendAsync(subscribeTypes.subscribeCampaignAssign, [username, permlink]);
          busyAPI.instance.subscribe((datad, j) => {
            if (j?.success && j?.permlink === permlink) {
              clearTimeout(timeoutId);
              dispatch(changeRewardsTab(username));
              resolve();
            }
          });
        }
      })
      .catch(error => reject(error));
  });
};

export const reservePropositionForQuick = permlink => async (
  dispatch,
  getState,
  { busyAPI, steemConnectAPI },
) => {
  const state = getState();
  const dish = getSelectedDish(state);
  const restaurant = getSelectedRestaurant(state);
  const username = getAuthenticatedUserName(state);
  const proposedWobjName = getObjectName(dish);
  const proposedAuthorPermlink = dish?.author_permlink;
  const secondaryObject = dish?.propositions?.[0] || dish;
  const primaryObject = dish?.parent;
  const rates = getTokenRatesInUSD(getState(), 'WAIV');
  const amount = round(secondaryObject.rewardInUSD / rates, 3);
  const detailsBody = await getNewDetailsBody(dish, restaurant);
  const isGuest = isGuestUser(state);

  const commentOp = [
    'comment',
    {
      parent_author: secondaryObject.guideName,
      parent_permlink: secondaryObject.activationPermlink,
      author: username,
      permlink,
      title: 'Rewards reservations',
      body: `<p>User ${username} (@${username}) has reserved the rewards of ${amount} ${
        secondaryObject.payoutToken
      } for a period of ${
        secondaryObject.countReservationDays
      } days to write a review of <a href='${getObjectUrlForLink(
        secondaryObject,
      )}'>${proposedWobjName}</a>${
        primaryObject.author_permlink !== secondaryObject.author_permlink
          ? `, <a href='${getObjectUrlForLink(primaryObject)}'>${getObjectName(primaryObject)}</a>`
          : ''
      }.</p>${detailsBody}`,
      json_metadata: JSON.stringify({
        app: config.appName,
        waivioRewards: {
          type: 'reserveCampaign',
          requiredObject: proposedAuthorPermlink,
        },
      }),
    },
  ];

  return new Promise(resolve => {
    steemConnectAPI
      .broadcast([commentOp])
      .then(async () => {
        const timeoutId = setTimeout(() => {
          dispatch(changeRewardsTab(username));
          resolve();
        }, 10000);

        if (!isGuest) {
          busyAPI.instance.sendAsync(subscribeTypes.subscribeCampaignAssign, [username, permlink]);
          busyAPI.instance.subscribe((datad, j) => {
            if (j?.success && j?.permlink === permlink) {
              clearTimeout(timeoutId);
              dispatch(changeRewardsTab(username));
              resolve();
            }
          });
        }
      })
      .catch(() => {
        setTimeout(() => {
          dispatch(changeRewardsTab(username));
          resolve();
        }, 7000);
      });
  });
};

export const realiseRewards = proposition => (dispatch, getState, { steemConnectAPI, busyAPI }) => {
  const unreservationPermlink = `reject-${proposition?.object?._id ||
    proposition?._id}-${generatePermlink()}`;
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
        const timeoutId = setTimeout(() => {
          dispatch(changeRewardsTab(username));
          resolve();
        }, 10000);

        busyAPI.instance.sendAsync(subscribeTypes.subscribeTransactionId, [
          username,
          unreservationPermlink,
        ]);
        busyAPI.instance.subscribe((datad, j) => {
          if (j?.success && j?.permlink === unreservationPermlink) {
            clearTimeout(timeoutId);
            dispatch(changeRewardsTab(username));
            resolve();
          }
        });
      })
      .catch(error => {
        message.error(error);
        reject(error);
      });
  });
};

export const rejectAuthorReview = proposition => (
  dispatch,
  getState,
  { steemConnectAPI, busyAPI },
) => {
  const authName = getAuthenticatedUserName(getState());
  const parent_author = proposition.reservationRootAuthor || proposition.rootName;
  const commentOp = [
    'comment',
    {
      parent_author,
      parent_permlink: proposition.reservationPermlink,
      author: proposition.guideName,
      permlink: createCommentPermlink(
        proposition.userName || parent_author,
        proposition.reservationPermlink,
      ),
      title: 'Cancelled reservation',
      body: `User <a href="https://www.waivio.com/@${proposition.guideName}">${
        proposition.guideName
      }</a> rejected review for <a href="https://www.waivio.com${
        proposition?.object?.defaultShowLink
      }">${getObjectName(proposition?.object)}</a> rewards campaign`,
      json_metadata: JSON.stringify({
        waivioRewards: {
          type: 'rejectReservationByGuide',
        },
      }),
    },
  ];
  const method = () =>
    proposition?.type === 'mentions'
      ? steemConnectAPI.rejectMentionRewards(
          authName,
          proposition.userName,
          proposition?.reservationPermlink,
        )
      : steemConnectAPI.broadcast([commentOp]);

  return new Promise((resolve, reject) => {
    method()
      .then(res => {
        busyAPI.instance.sendAsync(subscribeTypes.subscribeTransactionId, [
          proposition.guideName,
          res.result.id,
        ]);
        busyAPI.instance.subscribe((datad, j) => {
          if (j?.success && j?.permlink === res.result.id) {
            setTimeout(() => {
              resolve();
            }, 4000);
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

export const reinstateReward = proposition => (
  dispatch,
  getState,
  { steemConnectAPI, busyAPI },
) => {
  const authUserName = getAuthenticatedUserName(getState());
  const commentOp = [
    'comment',
    {
      parent_author: proposition?.rootName,
      parent_permlink: proposition?.reservationPermlink,
      author: authUserName,
      permlink: createCommentPermlink(proposition?.userName, proposition?.reservationPermlink),
      title: 'Reinstate reward',
      body: `Sponsor ${authUserName} (@${authUserName}) has reinstated the reward `,
      json_metadata: JSON.stringify({
        app: config.appName,
        waivioRewards: {
          type: 'restoreReservationByGuide',
        },
      }),
    },
  ];
  const method = () =>
    proposition.type === 'mentions'
      ? steemConnectAPI.restoreMentionRewards(
          authUserName,
          proposition.userName,
          proposition?.reservationPermlink,
        )
      : steemConnectAPI.broadcast([commentOp]);

  return new Promise((resolve, reject) => {
    method()
      .then(res => {
        busyAPI.instance.sendAsync(subscribeTypes.subscribeTransactionId, [
          proposition.guideName,
          res.result.id,
        ]);
        busyAPI.instance.subscribe((datad, j) => {
          if (j?.success && j?.permlink === res.result.id) {
            setTimeout(() => {
              resolve();
            }, 4000);
          }
        });
      })
      .catch(error => {
        reject(error);
      });
  });
};

export const decreaseReward = (proposition, amount, type) => (
  dispatch,
  getState,
  { steemConnectAPI, busyAPI },
) => {
  const autnUserName = getAuthenticatedUserName(getState());

  const details =
    type === 'increase'
      ? {
          body: `Sponsor ${autnUserName} (@${autnUserName}) has increased the reward by ${amount} WAIV`,
          title: 'Increase reward',
          json_metadata: JSON.stringify({
            waivioRewards: {
              type: 'raiseReviewReward',
              riseAmount: amount,
              activationPermlink: proposition?.activationPermlink,
            },
          }),
        }
      : {
          body: `User ${autnUserName} (@${autnUserName}) has decreased the reward by ${amount} WAIV`,
          title: 'Decrease reward',
          json_metadata: JSON.stringify({
            waivioRewards: {
              type: 'reduceReviewReward',
              reduceAmount: amount,
              activationPermlink: proposition?.activationPermlink,
            },
          }),
        };

  const commentOp = [
    'comment',
    {
      parent_author: proposition.rootName,
      parent_permlink: proposition.reservationPermlink,
      author: autnUserName,
      permlink: createCommentPermlink(proposition.userName, proposition.reservationPermlink),
      ...details,
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
            setTimeout(() => {
              resolve();
            }, 4000);
          }
        });
      })
      .catch(reject);
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
  { steemConnectAPI, busyAPI },
) => {
  const { auth } = getState();
  const userName = proposition?.reserved ? auth.user.name : proposition.userName;

  if (!auth.isAuthenticated) {
    return dispatch(notify('You have to be logged in to comment', 'error'));
  }

  if (!body || !body.length) {
    return dispatch(notify("Message can't be empty", 'error'));
  }

  const permlink = isUpdating
    ? originalComment.permlink
    : createCommentPermlink(userName, proposition?.reservationPermlink);
  const newBody = body;

  let detail = {};

  if (proposition.type === 'mentions') {
    detail = {
      parent_author: proposition.guideName,
      parent_permlink: proposition.activationPermlink,
      author: auth.user.name,
      permlink,
      title: '',
      body: newBody,
      json_metadata: JSON.stringify({
        ...createPostMetadata(body, [], isUpdating && jsonParse(originalComment.json_metadata)),
        waivioRewards: {
          type: 'createMessageThread',
          activationPermlink: proposition.activationPermlink,
          reservationPermlink: proposition.reservationPermlink,
        },
      }),
    };
  } else {
    detail = {
      parent_author: isUpdating ? originalComment.parent_author : proposition.rootName || userName,
      parent_permlink: isUpdating
        ? originalComment.parent_permlink
        : proposition?.reservationPermlink,
      author: auth.user.name,
      permlink,
      title: '',
      body: newBody,
      json_metadata: JSON.stringify(
        createPostMetadata(body, [], isUpdating && jsonParse(originalComment.json_metadata)),
      ),
    };
  }

  const commentOp = ['comment', detail];

  return new Promise(resolve =>
    steemConnectAPI
      .broadcast([commentOp])
      .then(res => {
        if (auth.isGuestUser) {
          resolve({
            ...detail,
            guestInfo: {
              userId: auth.user.name,
            },
          });
        } else {
          busyAPI.instance.sendAsync(subscribeTypes.subscribeTransactionId, [
            auth.user.name,
            res.result.id,
          ]);

          const timeoutID = setTimeout(() => {
            message.error(
              "Timed out, we can't connect. Please reload the page to see the changes. ",
            );
            resolve(detail);
          }, 10000);

          busyAPI.instance.subscribe((datad, j) => {
            if (j?.success && j?.permlink === res.result.id) {
              clearTimeout(timeoutID);
              message.success('Comment submitted');

              resolve(detail);
            }
          });
        }
      })
      .catch(err => {
        dispatch(notify(err.message || err.error_description, 'error'));
      }),
  );
};

export const sendInitialCommentForMentions = (proposition, body) => (
  dispatch,
  getState,
  { steemConnectAPI, busyAPI },
) => {
  const { auth } = getState();
  const userName = auth.user.name;
  const permlink = createCommentPermlink(userName, proposition?.reservationPermlink);
  const detail = {
    parent_author: proposition.guideName,
    parent_permlink: proposition.activationPermlink,
    author: auth.user.name,
    permlink,
    title: '',
    body: 'Initial chat',
    json_metadata: JSON.stringify({
      body: 'Initial chat',
      waivioRewards: {
        type: 'createMessageThread',
        activationPermlink: proposition.activationPermlink,
        reservationPermlink: proposition.reservationPermlink,
      },
    }),
  };

  const commentOp = ['comment', detail];

  return new Promise(resolve =>
    steemConnectAPI
      .broadcast([commentOp])
      .then(res => {
        if (auth.isGuestUser) {
          resolve({
            ...detail,
            guestInfo: {
              userId: auth.user.name,
            },
          });
        } else {
          busyAPI.instance.sendAsync(subscribeTypes.subscribeTransactionId, [
            auth.user.name,
            res.result.id,
          ]);
          const messagesPermlink = `${auth.user.name}/${permlink}`;
          const timeoutID = setTimeout(() => {
            dispatch(sendCommentForMentions({ ...proposition, messagesPermlink }, body)).then(() =>
              resolve({ ...detail, messagesPermlink }),
            );
          }, 10000);

          busyAPI.instance.subscribe((datad, j) => {
            if (j?.success && j?.permlink === res.result.id) {
              clearTimeout(timeoutID);
              dispatch(
                sendCommentForMentions({ ...proposition, messagesPermlink }, body),
              ).then(() => resolve({ ...detail, messagesPermlink }));
            }
          });
        }
      })
      .catch(err => {
        dispatch(notify(err.message || err.error_description, 'error'));
      }),
  );
};

export const sendCommentForMentions = (proposition, body, isUpdating = false, originalComment) => (
  dispatch,
  getState,
  { steemConnectAPI, busyAPI },
) => {
  const { auth } = getState();
  const userName = proposition?.reserved ? auth.user.name : proposition.userName;

  if (!auth.isAuthenticated) {
    return dispatch(notify('You have to be logged in to comment', 'error'));
  }

  if (!body || !body.length) {
    return dispatch(notify("Message can't be empty", 'error'));
  }

  const permlink = isUpdating
    ? originalComment.permlink
    : createCommentPermlink(userName, proposition?.reservationPermlink);

  const newBody = body;

  const [parent_author, parent_permlink] = proposition.messagesPermlink.split('/');

  const detail = {
    parent_author,
    parent_permlink,
    author: auth.user.name,
    permlink,
    title: '',
    body: newBody,
    json_metadata: JSON.stringify({
      ...createPostMetadata(body, [], isUpdating && jsonParse(originalComment.json_metadata)),
      waivioRewards: {
        type: 'campaignMessage',
        reservationPermlink: proposition.reservationPermlink,
      },
    }),
  };

  const commentOp = ['comment', detail];

  return new Promise(resolve =>
    steemConnectAPI
      .broadcast([commentOp])
      .then(res => {
        if (auth.isGuestUser) {
          resolve({
            ...detail,
            guestInfo: {
              userId: auth.user.name,
            },
          });
        } else {
          busyAPI.instance.sendAsync(subscribeTypes.subscribeTransactionId, [
            auth.user.name,
            res.result.id,
          ]);

          const timeoutID = setTimeout(() => {
            message.error(
              "Timed out, we can't connect. Please reload the page to see the changes. ",
            );
            resolve(detail);
          }, 10000);

          busyAPI.instance.subscribe((datad, j) => {
            if (j?.success && j?.permlink === res.result.id) {
              clearTimeout(timeoutID);
              message.success('Comment submitted');

              resolve(detail);
            }
          });
        }
      })
      .catch(err => {
        dispatch(notify(err.message || err.error_description, 'error'));
      }),
  );
};

export const GET_REWARDS_LIST = createAsyncActionType('GET_REWARDS_LIST');

export const getRewardsList = (showAll, query, sort, type) => (dispatch, getState) =>
  dispatch({
    type: GET_REWARDS_LIST.ACTION,
    payload: showAll
      ? getAllRewardList(0, query, sort, type)
      : getEligibleRewardList(getAuthenticatedUserName(getState()), 0, query, sort, type),
  });

export const GET_MORE_REWARDS_LIST = createAsyncActionType('GET_MORE_REWARDS_LIST');

export const getMoreRewardsList = (showAll, skip, query, sort, type) => (dispatch, getState) =>
  dispatch({
    type: GET_MORE_REWARDS_LIST.ACTION,
    payload: showAll
      ? getAllRewardList(skip, query, sort, type)
      : getEligibleRewardList(getAuthenticatedUserName(getState()), skip, query, sort, type),
  });

export default null;
