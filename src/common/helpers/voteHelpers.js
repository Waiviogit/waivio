import { includes, filter } from 'lodash';

export const getUpvotes = activeVotes => filter(activeVotes, vote => vote.percent > 0) || [];

export const getUpvotesQuontity = activeVotes => getUpvotes(activeVotes)?.length;

export const getAppendUpvotes = (activeVotes = []) =>
  filter(
    activeVotes,
    vote =>
      (vote.percent > 100 && vote.percent % 10 === 0) || (vote.percent > 0 && vote.percent <= 100),
  ) || [];

export const getDownvotes = activeVotes => filter(activeVotes, vote => vote.percent < 0) || [];

export const getDownvotesQuontity = activeVotes => getDownvotes(activeVotes)?.length;

export const getAppendDownvotes = (activeVotes = []) =>
  filter(
    activeVotes,
    vote => (vote.percent > 100 && vote.percent % 10 !== 0) || vote.percent < 0,
  ) || [];

export const getFollowingUpvotes = (activeVotes, following) =>
  filter(getUpvotes(activeVotes), vote => includes(following, vote.voter)) || [];

export const getFollowingDownvotes = (activeVotes, following) =>
  filter(getDownvotes(activeVotes), vote => includes(following, vote.voter)) || [];

export const sortVotes = (votes, sortBy) => votes.sort((a, b) => a[sortBy] - b[sortBy]);
