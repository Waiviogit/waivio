import sc2 from 'sc2-sdk';
import { waivioAPI } from '../waivioApi/ApiClient';

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
      console.log('\tbroadcast > ', JSON.stringify(operations));
      return waivioAPI.broadcastGuestOperation(`waivio_guest_`, operations, 'currUserName');
    };
    sc2Proto.me = function getUserAccount(username) {
      console.log('\tgetUserAccount > ', username);
      // return Promise.resolve({ name: username });
      return waivioAPI.getAuthenticatedUserMetadata(username);
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
  );

  return copied;
}

const api = sc2Extended();

export default api;
