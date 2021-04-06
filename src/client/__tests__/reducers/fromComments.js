import {
  getComments,
  getCommentsList,
  getCommentContent,
  getCommentsPendingVotes,
} from '../../store/reducers';

jest.mock('../../vendor/steemitHelpers.js', () => {});

describe('fromComments', () => {
  let author;
  let permlink;
  let state;

  beforeEach(() => {
    author = 'author';
    permlink = 'permlink';
    state = {
      comments: {
        comments: [
          {
            guestInfo: {
              userId: 'author',
            },
            author: 'author',
            permlink: 'permlink',
          },
        ],
        pendingVotes: 'pendingVotes',
      },
    };
  });

  it('Should return state comments', () => {
    expect(getComments(state)).toEqual(state.comments);
  });

  it('Should return comments', () => {
    expect(getCommentsList(state)).toEqual(state.comments.comments);
  });

  it('Should return pendingVotes', () => {
    expect(getCommentsPendingVotes(state)).toBe('pendingVotes');
  });

  it('Should return CommentContent', () => {
    expect(getCommentContent(state, author, permlink)).toBe(state.comments.comments[0]);
  });
});
