/* eslint-disable no-param-reassign */
import sc2 from 'sc2-sdk';
import { waivioAPI } from '../waivioApi/ApiClient';
import { getValidTokenData } from './helpers/getToken';

function broadcast(operations, isReview, actionAuthor) {
  let operation;
  if (operations[0][0] === 'custom_json') {
    if (operations[0][1].json.includes('reblog')) {
      operation = `waivio_guest_reblog`;
    } else {
      operation = `waivio_guest_${operations[0][1].id}`;
    }

    if (operations[0][1].json.includes('bell_notifications')) {
      operation = `waivio_guest_bell`;
    }
  } else if (operations[0][0] === 'comment') {
    const jsonMetadata = JSON.parse(operations[0][1].json_metadata);
    if (actionAuthor) operations[0][1].post_root_author = actionAuthor;
    if (jsonMetadata.comment) {
      operations[0][1].guest_root_author = operations[0][1].author;
      operations[0][1].author = jsonMetadata.comment.userId;
    }
    operation = `waivio_guest_${operations[0][0]}`;
  } else {
    operation = `waivio_guest_${operations[0][0]}`;
  }
  return waivioAPI.broadcastGuestOperation(operation, isReview, operations);
}

async function getUserAccount() {
  const userData = await getValidTokenData();
  const account = await waivioAPI.getUserAccount(userData.userData.name, true);
  return { account, name: account.name };
}

function sc2Extended() {
  const isGuest = () =>
    typeof localStorage !== 'undefined' &&
    !!localStorage.getItem('accessToken') &&
    !!localStorage.getItem('guestName');

  const sc2api = sc2.Initialize({
    app: process.env.STEEMCONNECT_CLIENT_ID,
    baseURL: process.env.STEEMCONNECT_HOST || 'https://hivesigner.com',
    callbackURL: process.env.STEEMCONNECT_REDIRECT_URL,
  });

  const sc2Proto = Object.create(Object.getPrototypeOf(sc2api));

  sc2Proto.broadcastOp = sc2Proto.broadcast;
  sc2Proto.meOp = sc2Proto.me;

  sc2Proto.broadcast = (operations, cb) => {
    if (isGuest()) return broadcast(operations, cb);
    return sc2Proto.broadcastOp(operations);
  };

  sc2Proto.me = () => {
    if (isGuest()) return getUserAccount();
    return sc2Proto.meOp();
  };

  return Object.assign(
    sc2Proto,
    sc2api,
    {
      followObject(follower, followingObject, name, type, cb) {
        const params = {
          required_auths: [],
          required_posting_auths: [follower],
          id: 'follow_wobject',
          json: JSON.stringify([
            'follow',
            {
              user: follower,
              author_permlink: followingObject,
              what: ['feed'],
              object_type: type,
              object_name: name,
              type_operation: 'follow_wobject',
            },
          ]),
        };
        return this.broadcast([['custom_json', params]], cb);
      },
    },
    {
      unfollowObject(unfollower, unfollowingObject, name, type, cb) {
        const params = {
          required_auths: [],
          required_posting_auths: [unfollower],
          id: 'follow_wobject',
          json: JSON.stringify([
            'follow',
            {
              user: unfollower,
              author_permlink: unfollowingObject,
              what: [],
              object_type: type,
              object_name: name,
              type_operation: 'unfollow_wobject',
            },
          ]),
        };
        return this.broadcast([['custom_json', params]], cb);
      },
    },
    {
      bellNotifications(follower, following, subscribe, cb) {
        const params = {
          required_auths: [],
          required_posting_auths: [follower],
          id: 'bell_notifications',
          json: JSON.stringify([
            'bell_notifications',
            {
              follower,
              following,
              subscribe,
            },
          ]),
        };

        return this.broadcast([['custom_json', params]], cb);
      },
    },
    {
      rankingObject(username, author, permlink, authorPermlink, rate, cb) {
        const params = {
          required_auths: [],
          required_posting_auths: [username],
          id: 'wobj_rating',
          json: JSON.stringify({ author, permlink, author_permlink: authorPermlink, rate }),
        };
        return this.broadcast([['custom_json', params]], cb);
      },
    },
    {
      settingMatchBotRule(username, ruleObj, cb) {
        const params = {
          required_auths: [],
          required_posting_auths: [username],
          id: 'match_bot_set_rule',
          json: JSON.stringify(ruleObj),
        };
        return this.broadcast([['custom_json', params]], cb);
      },
    },
    {
      settingMatchBotVotingPower(username, voteObj, cb) {
        const params = {
          required_auths: [],
          required_posting_auths: [username],
          id: 'match_bot_change_power',
          json: JSON.stringify(voteObj),
        };
        return this.broadcast([['custom_json', params]], cb);
      },
    },
    {
      deleteMatchBotRule(username, sponsorName, cb) {
        const params = {
          required_auths: [],
          required_posting_auths: [username],
          id: 'match_bot_remove_rule',
          json: JSON.stringify(sponsorName),
        };
        return this.broadcast([['custom_json', params]], cb);
      },
      changeBlackAndWhiteLists(username, id, user, cb) {
        const params = {
          required_auths: [],
          required_posting_auths: [username],
          id,
          json: JSON.stringify({ names: user }),
        };
        return this.broadcast([['custom_json', params]], cb);
      },
    },
  );
}

const api = sc2Extended();

export default api;
