/* eslint-disable no-param-reassign */
import hivesigner from 'hivesigner';
import { waivioAPI } from '../waivioApi/ApiClient';
import { getValidTokenData } from './helpers/getToken';

function broadcast(operations, isReview, actionAuthor) {
  let operation;
  if (operations[0][0] === 'custom_json') {
    if (operations[0][1].id.includes('confirm_referral_license')) {
      operation = 'confirm_referral_license';
    } else if (operations[0][1].id.includes('reject_referral_license')) {
      operation = 'reject_referral_license';
    } else if (operations[0][1].id.includes('add_referral_agent')) {
      operation = 'add_referral_agent';
    } else if (operations[0][1].json.includes('reblog')) {
      operation = `waivio_guest_reblog`;
    } else if (operations[0][1].json.includes('bell_notifications')) {
      operation = `waivio_guest_bell`;
    } else {
      operation = `waivio_guest_${operations[0][1].id}`;
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
  return waivioAPI.broadcastGuestOperation(operation, operations);
}

async function getUserAccount() {
  const userData = await getValidTokenData();
  const userName = userData.userData.name;
  const account = await waivioAPI.getUserAccount(userName, true, userName);
  return { account, name: account.name };
}

function sc2Extended() {
  const isGuest = () =>
    typeof localStorage !== 'undefined' &&
    !!localStorage.getItem('accessToken') &&
    !!localStorage.getItem('guestName');

  const sc2api = new hivesigner.Client({
    app: process.env.STEEMCONNECT_CLIENT_ID,
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
    {
      referralConfirmRules(username, isGuestUser, cb) {
        let params = {};
        if (isGuestUser) {
          params = {
            required_auths: [],
            required_posting_auths: [username],
            id: 'confirm_referral_license',
            json: {
              agent: username,
              isGuest: isGuestUser,
            },
          };
        } else {
          params = {
            required_auths: [],
            required_posting_auths: [username],
            id: 'confirm_referral_license',
            json: JSON.stringify({
              agent: username,
              isGuest: isGuestUser,
            }),
          };
        }
        return this.broadcast([['custom_json', params]], cb);
      },
    },
    {
      appendVote(voter, author, permlink, weight, cb) {
        const params = {
          required_auths: [],
          required_posting_auths: [voter],
          id: 'vote_append_object',
          json: JSON.stringify({
            author,
            permlink,
            weight,
            voter,
          }),
        };

        return this.broadcast([['custom_json', params]], cb);
      },
    },
    {
      referralRejectRules(username, isGuestUser, cb) {
        let params = {};
        if (isGuestUser) {
          params = {
            required_auths: [],
            required_posting_auths: [username],
            id: 'reject_referral_license',
            json: {
              agent: username,
              isGuest: isGuestUser,
            },
          };
        } else {
          params = {
            required_auths: [],
            required_posting_auths: [username],
            id: 'reject_referral_license',
            json: JSON.stringify({
              agent: username,
              isGuest: isGuestUser,
            }),
          };
        }
        return this.broadcast([['custom_json', params]], cb);
      },
    },
    {
      /*
        "agent" - field we get from link ?ref="agent_name".
         If guest agent, we send in agent name like before and in "isGuest" field write his name, not bool.
         For guest user send request without stringify
       */
      addReferralAgent(username, refUser, isGuestUser, refType = 'rewards', cb) {
        let params = {};
        if (isGuestUser) {
          params = {
            required_auths: [],
            required_posting_auths: [username],
            id: 'add_referral_agent',
            json: {
              agent: refUser,
              guestName: username,
              type: refType,
            },
          };
        } else {
          params = {
            required_auths: [],
            required_posting_auths: [username],
            id: 'add_referral_agent',
            json: JSON.stringify({
              agent: refUser,
              type: refType,
            }),
          };
        }
        return this.broadcast([['custom_json', params]], cb);
      },
    },
  );
}

const api = sc2Extended();

export default api;
