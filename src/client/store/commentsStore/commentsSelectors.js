import { createSelector } from 'reselect';

// selector
export const getComments = state => state.comments;

// reselect function
export const getCommentsList = createSelector([getComments], state => state.comments);
export const getCommentsPendingVotes = createSelector([getComments], state => state.pendingVotes);
export const getCommentContent = createSelector(getComments, (state, author, permlink) =>
  Object.values(state.comments).find(post => {
    const postAuthor = post.guestInfo ? post.guestInfo.userId : post.author;

    return postAuthor === author && post.permlink === permlink;
  }),
);
