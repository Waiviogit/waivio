/* eslint-disable no-param-reassign */
import hivesigner from 'hivesigner';
import { waivioAPI } from '../waivioApi/ApiClient';
import { getValidTokenData } from '../common/helpers/getToken';

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
    } else if (
      operations[0][1].json.includes('bell_notifications') ||
      operations[0][1].id === 'bell_notifications'
    ) {
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
  const account = await waivioAPI.getUserAccount(userData.userData.name, true);

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
      bellNotificationsWobject(follower, following, subscribe, cb) {
        const params = {
          required_auths: [],
          required_posting_auths: [follower],
          id: 'bell_notifications',
          json: JSON.stringify([
            'bell_wobject',
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
      activateWebsite(userName, host, subscribe, cb) {
        const params = {
          required_auths: [],
          required_posting_auths: [userName],
          id: 'active_custom_website',
          json: JSON.stringify({
            host,
          }),
        };

        return this.broadcast([['custom_json', params]], cb);
      },
    },
    {
      suspendWebsite(userName, host, subscribe, cb) {
        const params = {
          required_auths: [],
          required_posting_auths: [userName],
          id: 'suspend_custom_website',
          json: JSON.stringify({
            host,
          }),
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
          json: JSON.stringify({
            author,
            permlink,
            author_permlink: authorPermlink,
            rate,
            guestName: username,
          }),
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
      setMatchBot(username, ruleObj, cb) {
        const params = {
          required_auths: [],
          required_posting_auths: [username],
          id: 'matchBotSet',
          json: JSON.stringify(ruleObj),
        };

        return this.broadcast([['custom_json', params]], cb);
      },
    },
    {
      unsetMatchBot(username, name, type, cb) {
        const params = {
          required_auths: [],
          required_posting_auths: [username],
          id: 'matchBotUnset',
          json: JSON.stringify({ type, name }),
        };

        return this.broadcast([['custom_json', params]], cb);
      },
    },
    {
      addWebsiteAdministrators(username, host, names, cb) {
        const params = {
          required_auths: [],
          required_posting_auths: [username],
          id: 'website_add_administrators',
          json: JSON.stringify({ host, names }),
        };

        return this.broadcast([['custom_json', params]], cb);
      },
    },
    {
      deleteWebsiteAdministrators(username, host, names, cb) {
        const params = {
          required_auths: [],
          required_posting_auths: [username],
          id: 'website_remove_administrators',
          json: JSON.stringify({ host, names }),
        };

        return this.broadcast([['custom_json', params]], cb);
      },
    },
    {
      addWebsiteModerators(username, host, names, cb) {
        const params = {
          required_auths: [],
          required_posting_auths: [username],
          id: 'website_add_moderators',
          json: JSON.stringify({ host, names }),
        };

        return this.broadcast([['custom_json', params]], cb);
      },
    },
    {
      deleteWebsiteModerators(username, host, names, cb) {
        const params = {
          required_auths: [],
          required_posting_auths: [username],
          id: 'website_remove_moderators',
          json: JSON.stringify({ host, names }),
        };

        return this.broadcast([['custom_json', params]], cb);
      },
    },
    {
      addWebsiteAuthorities(username, host, names, cb) {
        const params = {
          required_auths: [],
          required_posting_auths: [username],
          id: 'website_add_authorities',
          json: JSON.stringify({ host, names }),
        };

        return this.broadcast([['custom_json', params]], cb);
      },
    },
    {
      deleteWebsiteAuthorities(username, host, names, cb) {
        const params = {
          required_auths: [],
          required_posting_auths: [username],
          id: 'website_remove_authorities',
          json: JSON.stringify({ host, names }),
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
      settingNewMatchBotVotingPower(username, votingPower, cb) {
        const params = {
          required_auths: [],
          required_posting_auths: [username],
          id: 'waivio_sb_change_power',
          json: JSON.stringify({ votingPower }),
        };

        return this.broadcast([['custom_json', params]], cb);
      },
    },
    {
      removeMatchBotRule(username, sponsor, cb) {
        const params = {
          required_auths: [],
          required_posting_auths: [username],
          id: 'waivio_sb_remove_rule',
          json: JSON.stringify(sponsor),
        };

        return this.broadcast([['custom_json', params]], cb);
      },
    },
    {
      setMatchBotNewRule(username, rule, cb) {
        const params = {
          required_auths: [],
          required_posting_auths: [username],
          id: 'waivio_sb_set_rule',
          json: JSON.stringify(rule),
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
      websitesReferral(account, host, owner, cb) {
        const params = {
          required_auths: [],
          required_posting_auths: [owner],
          id: 'website_referral_payments',
          json: JSON.stringify({
            account,
            host,
          }),
        };

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
      saveWebsiteSettings(
        username,
        appId,
        googleAnalyticsTag,
        beneficiary,
        currency,
        language,
        cb,
      ) {
        const params = {
          required_auths: [],
          required_posting_auths: [username],
          id: 'custom_website_settings',
          json: JSON.stringify({
            appId,
            googleAnalyticsTag,
            beneficiary,
            currency,
            language,
          }),
        };

        return this.broadcast([['custom_json', params]], cb);
      },
      hidePost(username, author, permlink, action, cb) {
        const params = {
          required_auths: [],
          required_posting_auths: [username],
          id: 'hide_post',
          json: JSON.stringify({
            author,
            permlink,
            action,
            ...(isGuest ? { guestName: username } : {}),
          }),
        };

        return this.broadcast([['custom_json', params]], cb);
      },
      hideComment(username, author, permlink, action, cb) {
        const params = {
          required_auths: [],
          required_posting_auths: [username],
          id: 'hide_comment',
          json: JSON.stringify({
            author,
            permlink,
            action,
            ...(isGuest ? { guestName: username } : {}),
          }),
        };

        return this.broadcast([['custom_json', params]], cb);
      },
      muteUser(follower, following, action, cb) {
        const params = {
          required_auths: [],
          required_posting_auths: [follower],
          id: 'follow',
          json: JSON.stringify([
            'follow',
            {
              follower,
              following,
              what: [...action],
            },
          ]),
        };

        return this.broadcast([['custom_json', params]], cb);
      },
      hiveEngineDepositWithdraw(user, data) {
        const params = {
          required_auths: [],
          required_posting_auths: [user],
          id: 'waivio_hive_engine',
          json: JSON.stringify({
            action: 'createDepositRecord',
            payload: data,
          }),
        };

        return this.broadcast([['custom_json', params]]);
      },
    },
  );
}

const api = sc2Extended();

export default api;
