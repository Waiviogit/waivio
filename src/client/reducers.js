import { combineReducers } from 'redux';

import { connectRouter } from 'connected-react-router';

import appReducer, * as fromApp from './app/appReducer';
import authReducer, * as fromAuth from './auth/authReducer';
import commentsReducer, * as fromComments from './comments/commentsReducer';
import feedReducer, * as fromFeed from './feed/feedReducer';
import postsReducer, * as fromPosts from './post/postsReducer';
import userReducer, * as fromUser from './user/userReducer';
import usersReducer, * as fromUsers from './user/usersReducer';
import notificationReducer from './app/Notification/notificationReducers';
import bookmarksReducer, * as fromBookmarks from './bookmarks/bookmarksReducer';
import favoritesReducer, * as fromFavorites from './favorites/favoritesReducer';
import editorReducer, * as fromEditor from './post/Write/editorReducer';
import walletReducer, * as fromWallet from './wallet/walletReducer';
import reblogReducers, * as fromReblog from './app/Reblog/reblogReducers';
import settingsReducer, * as fromSettings from './settings/settingsReducer';
import searchReducer, * as fromSearch from './search/searchReducer';
import quotesReducer from '../investarena/redux/reducers/quotesReducer';
import quotesSettingsReducer from '../investarena/redux/reducers/quotesSettingsReducer';
import platformReducer, * as fromPlatformReducer from '../investarena/redux/reducers/platformReducer';
import dealsReducer from '../investarena/redux/reducers/dealsReducer';
import modalsReducer from '../investarena/redux/reducers/modalsReducer';
import chartsReducer from '../investarena/redux/reducers/chartsReducer';
import forecastReducer, * as fromForecastReducer from '../investarena/redux/reducers/forecastReducer';
import topPerformersReducer, * as fromTopPerformers from '../investarena/redux/reducers/topPerformersReducer';
import wobjectReducer, * as fromObject from '../client/object/wobjectReducer';
import objectTypesReducer, * as fromObjectTypes from '../client/objectTypes/objectTypesReducer';
import objectTypeReducer, * as fromObjectType from '../client/objectTypes/objectTypeReducer';
import appendReducer, * as fromAppend from '../client/object/appendReducer';
import galleryReducer, * as fromGallery from '../client/object/ObjectGallery/galleryReducer';
import chatReducer, * as fromChat from '../client/components/Chat/chatReducer';

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
    quotes: quotesReducer,
    quotesSettings: quotesSettingsReducer,
    platform: platformReducer,
    charts: chartsReducer,
    deals: dealsReducer,
    modals: modalsReducer,
    append: appendReducer,
    gallery: galleryReducer,
    topPerformers: topPerformersReducer,
    forecasts: forecastReducer,
    chat: chatReducer,
  });

export const getIsAuthenticated = state => fromAuth.getIsAuthenticated(state.auth);
export const getIsAuthFetching = state => fromAuth.getIsAuthFetching(state.auth);
export const getIsLoaded = state => fromAuth.getIsLoaded(state.auth);
export const getIsReloading = state => fromAuth.getIsReloading(state.auth);
export const getAuthenticatedUser = state => fromAuth.getAuthenticatedUser(state.auth);
export const getAuthenticatedUserName = state => fromAuth.getAuthenticatedUserName(state.auth);
export const getAuthenticateduserMetaData = state =>
  fromAuth.getAuthenticateduserMetaData(state.auth);
export const getAuthenticatedUserAvatar = state => fromAuth.getAuthenticatedUserAvatar(state.auth);
export const isGuestUser = state => fromAuth.isGuestUser(state.auth);

export const getPosts = state => fromPosts.getPosts(state.posts);
export const getPostContent = (state, author, permlink) =>
  fromPosts.getPostContent(state.posts, author, permlink);
export const getPendingLikes = state => fromPosts.getPendingLikes(state.posts);
export const getIsPostFetching = (state, author, permlink) =>
  fromPosts.getIsPostFetching(state.posts, author, permlink);
export const getIsPostLoaded = (state, author, permlink) =>
  fromPosts.getIsPostLoaded(state.posts, author, permlink);
export const getIsPostFailed = (state, author, permlink) =>
  fromPosts.getIsPostFailed(state.posts, author, permlink);

export const getDraftPosts = state => fromEditor.getDraftPosts(state.editor);
export const getIsEditorLoading = state => fromEditor.getIsEditorLoading(state.editor);
export const getIsEditorSaving = state => fromEditor.getIsEditorSaving(state.editor);
export const getIsImageUploading = state => fromEditor.getIsImgLoading(state.editor);
export const getPendingDrafts = state => fromEditor.getPendingDrafts(state.editor);
export const getIsPostEdited = (state, permlink) =>
  fromEditor.getIsPostEdited(state.editor, permlink);

export const getRate = state => fromApp.getRate(state.app);
export const getIsTrendingTopicsLoading = state => fromApp.getIsTrendingTopicsLoading(state.app);
export const getRewardFund = state => fromApp.getRewardFund(state.app);
export const getIsFetching = state => fromApp.getIsFetching(state.app);
export const getIsBannerClosed = state => fromApp.getIsBannerClosed(state.app);
export const getAppUrl = state => fromApp.getAppUrl(state.app);
export const getUsedLocale = state => fromApp.getUsedLocale(state.app);
export const getScreenSize = state => fromApp.getScreenSize(state.app);
export const getTranslations = state => fromApp.getTranslations(state.app);
export const getCryptosPriceHistory = state => fromApp.getCryptosPriceHistory(state.app);
export const getShowPostModal = state => fromApp.getShowPostModal(state.app);
export const getCurrentShownPost = state => fromApp.getCurrentShownPost(state.app);

export const getFeed = state => fromFeed.getFeed(state.feed);

export const getComments = state => fromComments.getComments(state.comments);
export const getCommentsList = state => fromComments.getCommentsList(state.comments);
export const getCommentContent = (state, author, permlink) =>
  fromComments.getCommentContent(state.comments, author, permlink);
export const getCommentsPendingVotes = state =>
  fromComments.getCommentsPendingVotes(state.comments);

export const getBookmarks = state => fromBookmarks.getBookmarks(state.bookmarks);
export const getPendingBookmarks = state => fromBookmarks.getPendingBookmarks(state.bookmarks);

export const getRebloggedList = state => fromReblog.getRebloggedList(state.reblog);
export const getPendingReblogs = state => fromReblog.getPendingReblogs(state.reblog);

export const getFollowingList = state => fromUser.getFollowingList(state.user);
export const getFollowingObjectsList = state => fromUser.getFollowingObjectsList(state.user);
export const getPendingFollows = state => fromUser.getPendingFollows(state.user);
export const getPendingFollowingObjects = state => fromUser.getPendingFollowingObjects(state.user);
export const getIsFetchingFollowingList = state => fromUser.getIsFetchingFollowingList(state.user);
export const getRecommendedObjects = state => fromUser.getRecommendedObjects(state.user);
export const getFollowingFetched = state => fromUser.getFollowingFetched(state.user);
export const getNotifications = state => fromUser.getNotifications(state.user);
export const getIsLoadingNotifications = state => fromUser.getIsLoadingNotifications(state.user);
export const getFetchFollowListError = state => fromUser.getFetchFollowListError(state.user);
export const getLatestNotification = state => fromUser.getLatestNotification(state.user);
export const getUserLocation = state => fromUser.getUserLocation(state.user);
export const getAccuracyChartLoaded = state => fromUser.getAccuracyChartLoaded(state.user);
export const getChatCondition = state => fromUser.getChatCondition(state.user);
export const getChatConnectionCondition = state => fromUser.getChatConnectionCondition(state.user);

export const getPostMessageType = state => fromChat.getPostMessageType(state.chat);
export const getPostMessageData = state => fromChat.getPostMessageData(state.chat);

export const getUser = (state, username) => fromUsers.getUser(state.users, username);
export const getIsUserFetching = (state, username) =>
  fromUsers.getIsUserFetching(state.users, username);
export const getIsUserLoaded = (state, username) =>
  fromUsers.getIsUserLoaded(state.users, username);
export const getIsUserFailed = (state, username) =>
  fromUsers.getIsUserFailed(state.users, username);
export const getTopExperts = state => fromUsers.getTopExperts(state.users);
export const getTopExpertsLoading = state => fromUsers.getTopExpertsLoading(state.users);
export const getTopExpertsHasMore = state => fromUsers.getTopExpertsHasMore(state.users);
export const getRandomExperts = state => fromUsers.getRandomExperts(state.users);
export const getRandomExpertsLoaded = state => fromUsers.getRandomExpertsLoaded(state.users);
export const getRandomExpertsLoading = state => fromUsers.getRandomExpertsLoading(state.users);

export const getFavoriteCategories = state => fromFavorites.getFavoriteCategories(state.favorites);

export const getIsTransferVisible = state => fromWallet.getIsTransferVisible(state.wallet);
export const getTransferTo = state => fromWallet.getTransferTo(state.wallet);
export const getTransferAmount = state => fromWallet.getTransferAmount(state.wallet);
export const getTransferCurrency = state => fromWallet.getTransferCurrency(state.wallet);
export const getTransferMemo = state => fromWallet.getTransferMemo(state.wallet);
export const getIsPowerUpOrDownVisible = state =>
  fromWallet.getIsPowerUpOrDownVisible(state.wallet);
export const getIsPowerDown = state => fromWallet.getIsPowerDown(state.wallet);

export const getIsSettingsLoading = state => fromSettings.getIsLoading(state.settings);
export const getLocale = state => fromSettings.getLocale(state.settings);
export const getReadLanguages = state => fromSettings.getReadLanguages(state.settings);
export const getVotingPower = state => fromSettings.getVotingPower(state.settings);
export const getVotePercent = state => fromSettings.getVotePercent(state.settings);
export const getShowNSFWPosts = state => fromSettings.getShowNSFWPosts(state.settings);
export const getNightmode = state => fromSettings.getNightmode(state.settings);
export const getRewriteLinks = state => fromSettings.getRewriteLinks(state.settings);
export const getUpvoteSetting = state => fromSettings.getUpvoteSetting(state.settings);
export const getExitPageSetting = state => fromSettings.getExitPageSetting(state.settings);
export const getRewardSetting = state => fromSettings.getRewardSetting(state.settings);

export const getTotalVestingShares = state => fromWallet.getTotalVestingShares(state.wallet);
export const getTotalVestingFundSteem = state => fromWallet.getTotalVestingFundSteem(state.wallet);
export const getUsersTransactions = state => fromWallet.getUsersTransactions(state.wallet);
export const getUsersAccountHistory = state => fromWallet.getUsersAccountHistory(state.wallet);
export const getUsersAccountHistoryLoading = state =>
  fromWallet.getUsersAccountHistoryLoading(state.wallet);
export const getUsersEstAccountsValues = state =>
  fromWallet.getUsersEstAccountsValues(state.wallet);
export const getLoadingEstAccountValue = state =>
  fromWallet.getLoadingEstAccountValue(state.wallet);
export const getLoadingGlobalProperties = state =>
  fromWallet.getLoadingGlobalProperties(state.wallet);
export const getLoadingMoreUsersAccountHistory = state =>
  fromWallet.getLoadingMoreUsersAccountHistory(state.wallet);
export const getUserHasMoreAccountHistory = (state, username) =>
  fromWallet.getUserHasMoreAccountHistory(state.wallet, username);
export const getAccountHistoryFilter = state => fromWallet.getAccountHistoryFilter(state.wallet);
export const getCurrentDisplayedActions = state =>
  fromWallet.getCurrentDisplayedActions(state.wallet);
export const getCurrentFilteredActions = state =>
  fromWallet.getCurrentFilteredActions(state.wallet);
export const getGuestUserBalance = state => fromWallet.getGuestUserBalance(state.wallet);

export const getSearchLoading = state => fromSearch.getSearchLoading(state.search);
export const getSearchResults = state => fromSearch.getSearchResults(state.search);
export const getAutoCompleteSearchResults = state =>
  fromSearch.getAutoCompleteSearchResults(state.search);
export const getSearchObjectsResults = state => fromSearch.getSearchObjectsResults(state.search);
export const getSearchUsersResults = state => fromSearch.getSearchUsersResults(state.search);
export const searchObjectTypesResults = state => fromSearch.searchObjectTypesResults(state.search);

export const getObject = state => fromObject.getObjectState(state.object);
export const getObjectFetchingState = state => fromObject.getObjectFetchingState(state.object);
export const getObjectAuthor = state => fromObject.getObjectAuthor(state.object);
export const getObjectFields = state => fromObject.getObjectFields(state.object);
export const getRatingFields = state => fromObject.getRatingFields(state.object);

export const getObjectTypesList = state => fromObjectTypes.getObjectTypesList(state.objectTypes);
export const getObjectTypesLoading = state =>
  fromObjectTypes.getObjectTypesLoading(state.objectTypes);

export const getObjectTypeState = state => fromObjectType.getObjectType(state.objectType);
export const getObjectTypeLoading = state => fromObjectType.getObjectTypeLoading(state.objectType);
export const getFilteredObjects = state => fromObjectType.getFilteredObjects(state.objectType);
export const getHasMoreRelatedObjects = state =>
  fromObjectType.getHasMoreRelatedObjects(state.objectType);
export const getAvailableFilters = state => fromObjectType.getAvailableFilters(state.objectType);
export const getActiveFilters = state => fromObjectType.getActiveFilters(state.objectType);
export const getTypeName = state => fromObjectType.getTypeName(state.objectType);
export const getHasMap = state => fromObjectType.getHasMap(state.objectType);
export const getObjectTypeSorting = state => fromObjectType.getSorting(state.objectType);

export const getIsAppendLoading = state => fromAppend.getIsAppendLoading(state.append);

export const getObjectAlbums = state => fromGallery.getObjectAlbums(state.gallery);
export const getIsObjectAlbumsLoading = state =>
  fromGallery.getIsObjectAlbumsLoading(state.gallery);

// common selectors

export const getCurrentLocation = state => state.router.location;
export const getQueryString = state => state.router.location.search;

export const getSuitableLanguage = state => {
  const settingsLocale = getLocale(state);
  if (settingsLocale !== 'auto') return settingsLocale;

  const usedLocale = getUsedLocale(state);
  return usedLocale || 'en-US';
};

export const getPerformersStatistic = state =>
  fromTopPerformers.getPerformersStatistic(state.topPerformers);
export const getPerformersStatisticLoading = state =>
  fromTopPerformers.getPerformersStatisticLoading(state.topPerformers);
export const getPerformersStatisticLoaded = state =>
  fromTopPerformers.getPerformersStatisticLoaded(state.topPerformers);

export const getForecastData = state => fromForecastReducer.getForecastData(state.forecasts);

export const getPlatformName = state => fromPlatformReducer.getPlatformName(state.platform);
export const getAccountsMap = state => fromPlatformReducer.getAccountsMap(state.platform);
