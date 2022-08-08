import { round } from 'lodash';
import { useMemo } from 'react';

import { generatePermlink, getObjectName } from '../common/helpers/wObjectHelper';
import { getCurrentHivePrice } from '../waivioApi/ApiClient';
import { getDetailsBody } from '../client/rewards/rewardsHelper';
import config from '../waivioApi/config.json';
import { subscribeTypes } from '../common/constants/blockTypes';
import steemConnectAPI from '../client/steemConnectAPI';
import createBusyAPI from '../common/services/createBusyAPI';

const useRewards = () => {
  const busyAPI = useMemo(() => createBusyAPI(), []);

  const reserveProposition = async (proposition, username) => {
    const permlink = `reserve-${generatePermlink()}`;
    const dish = proposition?.object;
    const proposedWobjName = getObjectName(dish);
    const proposedWobjAuthorPermlink = dish?.author_permlink;
    const primaryObject = proposition?.object?.parent;
    const currencyInfo = await getCurrentHivePrice();
    const amount = round(proposition.reward / currencyInfo.hiveCurrency, 3);
    const detailsBody = getDetailsBody({
      proposition,
      proposedWobjName,
      proposedWobjAuthorPermlink,
      primaryObjectName: getObjectName(primaryObject),
    });

    const commentOp = [
      'comment',
      {
        parent_author: proposition.guideName,
        parent_permlink: proposition.activationPermlink,
        author: username,
        permlink,
        title: 'Rewards reservations',
        body: `<p>User ${username} (@${username}) has reserved the rewards of ${amount} HIVE for a period of ${
          proposition.countReservationDays
        } days to write a review of <a href="/object/${
          dish.author_permlink
        }">${proposedWobjName}</a>, <a href="/object/${
          primaryObject?.author_permlink
        }">${getObjectName(primaryObject)}</a></p>${detailsBody}`,
        json_metadata: JSON.stringify({
          app: config.appName,
          waivioRewards: {
            type: 'reserveCampaign',
            requiredObject: proposedWobjAuthorPermlink,
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
            if (j?.result?.assigned && j?.result?.permlink === permlink) {
              resolve();
            }
          });
        })
        .catch(error => reject(error));
    });
  };

  const realiseRewards = (proposition, username) => {
    const unreservationPermlink = `reject-${proposition._id}${generatePermlink()}`;

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

  return {
    reserveProposition,
    realiseRewards,
  };
};

export default useRewards;
