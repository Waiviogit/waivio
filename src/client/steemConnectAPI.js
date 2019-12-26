import sc2 from 'sc2-sdk';
import { waivioAPI } from '../waivioApi/ApiClient';
import { getValidTokenData } from './helpers/getToken';

function sc2Extended() {
  const sc2api = sc2.Initialize({
    app: process.env.STEEMCONNECT_CLIENT_ID,
    baseURL: process.env.STEEMCONNECT_HOST,
    callbackURL: process.env.STEEMCONNECT_REDIRECT_URL,
  });

  const sc2Proto = Object.create(Object.getPrototypeOf(sc2api));

  let isGuest = false;
  if (typeof localStorage !== 'undefined') {
    isGuest = localStorage.getItem('accessToken');
  }
  if (isGuest) {
    sc2Proto.broadcast = function broadcast(operations) {
      console.log('\tbroadcast > ', operations);
      let operation;
      if (operations[0][0] === 'custom_json') {
        if (operations[0][1].json.includes('reblog')) {
          operation = `waivio_guest_reblog`;
        } else {
          operation = `waivio_guest_${operations[0][1].id}`;
        }
      } else if (operations[0][0] === 'comment') {
        const jsonMetadata = JSON.parse(operations[0][1].json_metadata);
        if (jsonMetadata.comment) {
          // eslint-disable-next-line no-param-reassign
          operations[0][1].guest_root_author = operations[0][1].author;
          // eslint-disable-next-line no-param-reassign
          operations[0][1].author = jsonMetadata.comment.userId;
        }
        operation = `waivio_guest_${operations[0][0]}`;
      } else {
        operation = `waivio_guest_${operations[0][0]}`;
      }
      return waivioAPI.broadcastGuestOperation(operation, operations);
    };
    sc2Proto.me = async function getUserAccount() {
      const userData = await getValidTokenData();
      console.log('\tgetUserAccount > ', userData.userData.name);
      // return Promise.resolve({ name: username });
      const account = await waivioAPI.getUserAccount(userData.userData.name);
      return { account, name: account.name };
    };
  }

  const copied = Object.assign(
    sc2Proto,
    sc2api,
    {
      followObject(follower, followingObject, cb) {
        const params = {
          required_auths: [],
          required_posting_auths: [follower],
          id: 'follow_wobject',
          json: JSON.stringify([
            'follow',
            { user: follower, author_permlink: followingObject, what: ['feed'] },
          ]),
        };
        return this.broadcast([['custom_json', params]], cb);
      },
    },
    {
      unfollowObject(unfollower, unfollowingObject, cb) {
        const params = {
          required_auths: [],
          required_posting_auths: [unfollower],
          id: 'follow_wobject',
          json: JSON.stringify([
            'follow',
            { user: unfollower, author_permlink: unfollowingObject, what: [] },
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
          id: 'match_bot_rule',
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
  );

  return copied;
}

const api = sc2Extended();

export default api;
