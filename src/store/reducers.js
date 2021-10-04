import { combineReducers } from 'redux';

import { connectRouter } from 'connected-react-router';

import appReducer from './appStore/appReducer';
import authReducer from './authStore/authReducer';
import commentsReducer from './commentsStore/commentsReducer';
import feedReducer from './feedStore/feedReducer';
import postsReducer from './postsStore/postsReducer';
import userReducer from './userStore/userReducer';
import usersReducer from './usersStore/usersReducer';
import notificationReducer from '../client/app/Notification/notificationReducers';
import bookmarksReducer from './bookmarksStore/bookmarksReducer';
import favoritesReducer from './favoritesStore/favoritesReducer';
import editorReducer from './editorStore/editorReducer';
import walletReducer from './walletStore/walletReducer';
import reblogReducers from './reblogStore/reblogReducers';
import settingsReducer from './settingsStore/settingsReducer';
import searchReducer from './searchStore/searchReducer';
import wobjectReducer from './wObjectStore/wobjectReducer';
import objectTypesReducer from './objectTypesStore/objectTypesReducer';
import objectTypeReducer from './objectTypeStore/objectTypeReducer';
import appendReducer from './appendStore/appendReducer';
import galleryReducer from './galleryStore/galleryReducer';
import mapReducer from './mapStore/mapReducer';
import rewardsReducer from './rewardsStore/rewardsReducer';
import websiteReducer from './websiteStore/websiteReducer';
import referralReducer from './referralStore/ReferralReducer';
import { getUsedLocale } from './appStore/appSelectors';
import { getLocale } from './settingsStore/settingsSelectors';
import advancedReducer from './advancedReports/advancedReducer';
import quickRewardsReducer from './quickRewards/quickRewardsReducer';

export default history =>
  combineReducers({
    app: appReducer,
    auth: authReducer,
    comments: commentsReducer,
    editor: editorReducer,
    posts: postsReducer,
    feed: feedReducer,
    objectTypes: objectTypesReducer,
    objectType: objectTypeReducer,
    user: userReducer,
    users: usersReducer,
    object: wobjectReducer,
    notifications: notificationReducer,
    bookmarks: bookmarksReducer,
    favorites: favoritesReducer,
    reblog: reblogReducers,
    router: connectRouter(history),
    wallet: walletReducer,
    settings: settingsReducer,
    search: searchReducer,
    append: appendReducer,
    gallery: galleryReducer,
    map: mapReducer,
    rewards: rewardsReducer,
    referral: referralReducer,
    website: websiteReducer,
    advancedReports: advancedReducer,
    quickRewards: quickRewardsReducer,
  });

// common selectors

export const getCurrentLocation = state => state.router.location;
export const getQueryString = state => state.router.location.search;

export const getSuitableLanguage = state => {
  const settingsLocale = getLocale(state);

  if (settingsLocale !== 'auto') return settingsLocale;

  const usedLocale = getUsedLocale(state);

  return usedLocale || 'en-US';
};
