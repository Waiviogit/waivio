import { get } from 'lodash';

export const getFeed = state => state.feed;
export const getBlogFilters = state => get(getFeed(state), 'blog.tagConditions');
export const getBlogFiltersList = (state, name) => get(getFeed(state), ['blog', name, 'tags']);
export const getProfileTags = state => get(getFeed(state), 'tags');
export const getTiktokPreviewFromState = state => get(getFeed(state), 'tiktokPreview');
export const getPreviewLoadingFromState = state => get(getFeed(state), 'previewLoading');
export const getFirstLoadingFromState = state => get(getFeed(state), 'firstLoading');
export const getPinnedPostsUrls = state => get(getFeed(state), 'pinnedPosts');
