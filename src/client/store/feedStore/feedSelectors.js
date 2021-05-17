import { get } from 'lodash';

export const getFeed = state => state.feed;
export const getBlogFilters = state => get(getFeed(state), 'blog.tagConditions');
