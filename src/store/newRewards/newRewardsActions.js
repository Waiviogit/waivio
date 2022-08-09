import { round } from 'lodash';

import { generatePermlink, getObjectName } from '../../common/helpers/wObjectHelper';
import { getNewDetailsBody } from '../../client/rewards/rewardsHelper';
import config from '../../waivioApi/config.json';
import { subscribeTypes } from '../../common/constants/blockTypes';
import { getAuthenticatedUserName } from '../authStore/authSelectors';
import { changeRewardsTab } from '../authStore/authActions';
import { getTokenRatesInUSD } from '../walletStore/walletSelectors';

export const reserveProposition = (proposition, username) => async (
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
  const amount = round(proposition.rewardInUSD * rates, 3);
  const detailsBody = getNewDetailsBody(proposition);

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
      } for a period of ${proposition.countReservationDays} days to write a review of <a href={${
        dish.defaultShowLink
      }}>${proposedWobjName}</a>, <a href={${primaryObject.defaultShowLink}}>${getObjectName(
        primaryObject,
      )}</a></p>${detailsBody}`,
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
          if (j?.assigned && j?.permlink === permlink) {
            dispatch(changeRewardsTab(username));
            resolve();
          }
        });
      })
      .catch(error => reject(error));
  });
};

export const realiseRewards = proposition => (dispatch, getState, { steemConnectAPI }) => {
  const unreservationPermlink = `reject-${proposition._id}${generatePermlink()}`;
  const username = getAuthenticatedUserName(getState());

  const commentOp = [
    'comment',
    {
      parent_author: proposition?.guideName,
      parent_permlink: proposition?.activationPermlink,
      author: username,
      permlink: unreservationPermlink,
      title: 'Cancelled reservation',
      body: `User <a href="https://www.waivio.com/@${username}">${username}</a> cancelled reservation for <a href="https://www.waivio.com/@${
        proposition?.guideName
      }/${proposition?.guideName}">${getObjectName(proposition?.object)} rewards campaign</a>`,
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
      .then(() => resolve('SUCCESS'))
      .catch(error => reject(error));
  });
};

export default null;
