import sc2 from 'sc2-sdk';

function sc2Extended() {
  const sc2api = sc2.Initialize({
    app: process.env.STEEMCONNECT_CLIENT_ID,
    baseURL: process.env.STEEMCONNECT_HOST,
    callbackURL: process.env.STEEMCONNECT_REDIRECT_URL,
  });

  const copied = Object.assign(
    Object.create(Object.getPrototypeOf(sc2api)),
    sc2api,
    {
      followObject(follower, followingObject = '', sessionId = 0, cb) {
        const params = {
          required_auths: [],
          required_posting_auths: [follower],
          id: 'follow_wobject',
          json: JSON.stringify([
            'follow',
            {
              user: follower,
              author_permlink: followingObject,
              session_id: sessionId,
              what: ['feed'],
            },
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
      settingSessionId(username, sessionId, cb) {
        const params = {
          required_auths: [],
          required_posting_auths: [username],
          id: 'session_id',
          json: JSON.stringify({ session_id: sessionId }),
        };
        return this.broadcast([['custom_json', params]], cb);
      },
    },
  );

  return copied;
}

const api = sc2Extended();

export default api;
