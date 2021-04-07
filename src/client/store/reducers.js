import { combineReducers } from 'redux';

import { connectRouter } from 'connected-react-router';

import appReducer from './appStore/appReducer';
import authReducer from './authStore/authReducer';
import commentsReducer from './commentsStore/commentsReducer';
import feedReducer from './feedStore/feedReducer';
import postsReducer from './postsStore/postsReducer';
import userReducer from './userStore/userReducer';
import usersReducer from './usersStore/usersReducer';
import notificationReducer from '../app/Notification/notificationReducers';
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
import websiteReducer, * as fromWebsite from '../websites/websiteReducer';
import referralReducer from './referralStore/ReferralReducer';
import { getUsedLocale } from './appStore/appSelectors';
import { getLocale } from './settingsStore/settingsSelectors';

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

// website
export const getParentDomain = state => fromWebsite.getParentDomain(state.website);
export const getDomainAvailableStatus = state =>
  fromWebsite.getDomainAvailableStatus(state.website);
export const getWebsiteLoading = state => fromWebsite.getWebsiteLoading(state.website);
export const getCreateWebsiteLoading = state => fromWebsite.getCreateWebsiteLoading(state.website);
export const getManage = state => fromWebsite.getManage(state.website);
export const getReports = state => fromWebsite.getReports(state.website);
export const getOwnWebsites = state => fromWebsite.getOwnWebsites(state.website);
export const getConfiguration = state => fromWebsite.getConfiguration(state.website);
export const getAdministrators = state => fromWebsite.getAdministrators(state.website);
export const getModerators = state => fromWebsite.getModerators(state.website);
export const getAuthorities = state => fromWebsite.getAuthorities(state.website);
export const getTagsSite = state => fromWebsite.getTagsSite(state.website);
export const getSettingsSite = state => fromWebsite.getSettingsSite(state.website);
export const getIsLoadingAreas = state => fromWebsite.getIsLoadingAreas(state.website);
export const getRestrictions = state => fromWebsite.getRestrictions(state.website);
export const getMuteLoading = state => fromWebsite.getMuteLoading(state.website);
export const getUnmutedUsers = state => fromWebsite.getUnmutedUsers(state.website);
export const getWobjectsPoint = state => fromWebsite.getWobjectsPoint(state.website);
export const getIsUsersAreas = state => fromWebsite.getIsUsersAreas(state.website);
export const getShowReloadButton = state => fromWebsite.getShowReloadButton(state.website);
