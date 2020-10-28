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
import wobjectReducer, * as fromObject from '../client/object/wobjectReducer';
import objectTypesReducer, * as fromObjectTypes from '../client/objectTypes/objectTypesReducer';
import objectTypeReducer, * as fromObjectType from '../client/objectTypes/objectTypeReducer';
import appendReducer, * as fromAppend from '../client/object/appendReducer';
import galleryReducer, * as fromGallery from '../client/object/ObjectGallery/galleryReducer';
import mapReducer, * as fromMap from '../client/components/Maps/mapReducer';
import rewardsReducer, * as fromRewards from '../client/rewards/rewardsReducer';
import referralReducer, * as fromReferral from '../client/rewards/ReferralProgram/ReferralReducer';

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
  });

export const getIsAuthenticated = state => fromAuth.getIsAuthenticated(state.auth);
export const getIsAuthFetching = state => fromAuth.getIsAuthFetching(state.auth);
export const getIsLoaded = state => fromAuth.getIsLoaded(state.auth);
export const getIsReloading = state => fromAuth.getIsReloading(state.auth);
export const getAuthenticatedUser = state => fromAuth.getAuthenticatedUser(state.auth);
export const getAuthenticatedUserName = state => fromAuth.getAuthenticatedUserName(state.auth);
export const getAuthenticatedUserMetaData = state =>
  fromAuth.getAuthenticateduserMetaData(state.auth);
export const getAuthenticatedUserNotificationsSettings = state =>
  fromAuth.getAuthenticatedUserNotificationsSettings(state.auth);
export const getAuthenticatedUserAvatar = state => fromAuth.getAuthenticatedUserAvatar(state.auth);
export const isGuestUser = state => fromAuth.isGuestUser(state.auth);
export const getAuthenticatedUserPrivateEmail = state =>
  fromAuth.getAuthenticatedUserPrivateEmail(state.auth);
export const getAuthorizationUserFollowSort = state =>
  fromAuth.getAuthorizationUserFollowSort(state.auth);

export const getPosts = state => fromPosts.getPosts(state.posts);
export const getPostContent = (state, permlink, author) =>
  fromPosts.getPostContent(state.posts, permlink, author);
export const getPendingLikes = state => fromPosts.getPendingLikes(state.posts);
export const getIsPostFetching = (state, author, permlink) =>
  fromPosts.getIsPostFetching(state.posts, author, permlink);
export const getIsPostLoaded = (state, author, permlink) =>
  fromPosts.getIsPostLoaded(state.posts, author, permlink);
export const getIsPostFailed = (state, author, permlink) =>
  fromPosts.getIsPostFailed(state.posts, author, permlink);
export const getLastPostId = state => fromPosts.getLastPostId(state.posts);

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
export const getTranslationByKey = (state, key, defaultMessage) =>
  fromApp.getTranslationByKey(state.app, key, defaultMessage);
export const getCryptosPriceHistory = state => fromApp.getCryptosPriceHistory(state.app);
export const getShowPostModal = state => fromApp.getShowPostModal(state.app);
export const getCurrentShownPost = state => fromApp.getCurrentShownPost(state.app);
export const getIsMobile = state => fromApp.getIsMobile(state.app);
export const getWeightValue = (state, weight) => fromApp.getWeightValue(state.app, weight);

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
export const getFollowingUpdates = state => fromUser.getFollowingUpdates(state.user);
export const getFollowingUsersUpdates = state => fromUser.getFollowingUsersUpdates(state.user);
export const getFollowingObjectsUpdatesByType = (state, objType) =>
  fromUser.getFollowingObjectsUpdatesByType(state.user, objType);
export const getFollowingUpdatesFetched = state => fromUser.getFollowingUpdatesFetched(state.user);
export const getPendingUpdate = state => fromUser.getPendingUpdate(state.user);

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
export const getAllUsers = state => fromUsers.getAllUsers(state.users);

export const getFavoriteCategories = state => fromFavorites.getFavoriteCategories(state.favorites);

export const getIsTransferVisible = state => fromWallet.getIsTransferVisible(state.wallet);
export const getTransferTo = state => fromWallet.getTransferTo(state.wallet);
export const getTransferAmount = state => fromWallet.getTransferAmount(state.wallet);
export const getTransferCurrency = state => fromWallet.getTransferCurrency(state.wallet);
export const getTransferMemo = state => fromWallet.getTransferMemo(state.wallet);
export const getTransferApp = state => fromWallet.getTransferApp(state.wallet);
export const getIsPowerUpOrDownVisible = state =>
  fromWallet.getIsPowerUpOrDownVisible(state.wallet);
export const getIsPowerDown = state => fromWallet.getIsPowerDown(state.wallet);
export const getStatusWithdraw = state => fromWallet.getStatusWithdraw(state.wallet);
export const hasMoreGuestActions = state => fromWallet.hasMoreGuestActions(state.wallet);
export const getIsErrorLoading = state => fromWallet.getIsErrorLoading(state.wallet);
export const getIsErrorLoadingTable = state => fromWallet.getIsErrorLoadingTable(state.wallet);
export const getOperationNum = state => fromWallet.getOperationNum(state.wallet);
export const getTableOperationNum = state => fromWallet.getTableOperationNum(state.wallet);
export const getIsloadingMoreTransactions = state =>
  fromWallet.getIsloadingMoreTransactions(state.wallet);
export const getIsloadingMoreTableTransactions = state =>
  fromWallet.getIsloadingMoreTableTransactions(state.wallet);
export const getIsloadingTableTransactions = state =>
  fromWallet.getIsloadingTableTransactions(state.wallet);
export const getIsOpenWalletTable = state => fromWallet.getIsOpenWalletTable(state.wallet);

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
export const getHiveBeneficiaryAccount = state =>
  fromSettings.getHiveBeneficiaryAccount(state.settings);
export const isOpenLinkModal = state => fromSettings.isOpenLinkModal(state.settings);

export const getTotalVestingShares = state => fromWallet.getTotalVestingShares(state.wallet);
export const getTotalVestingFundSteem = state => fromWallet.getTotalVestingFundSteem(state.wallet);
export const getUsersTransactions = state => fromWallet.getUsersTransactions(state.wallet);
export const getTransactions = state => fromWallet.getTransactions(state.wallet);
export const getTableTransactions = state => fromWallet.getTableTransactions(state.wallet);
export const getUserHasMore = state => fromWallet.getUserHasMore(state.wallet);
export const getUserHasMoreTable = state => fromWallet.getUserHasMoreTable(state.wallet);
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

export const getSearchLoading = state => fromSearch.getSearchLoading(state.search);
export const getSearchResults = state => fromSearch.getSearchResults(state.search);
export const getAutoCompleteSearchResults = state =>
  fromSearch.getAutoCompleteSearchResults(state.search);
export const getSearchObjectsResults = state => fromSearch.getSearchObjectsResults(state.search);
export const getSearchUsersResults = state => fromSearch.getSearchUsersResults(state.search);
export const getSearchUsersResultsForDiscoverPage = state =>
  fromSearch.getSearchUsersResultsForDiscoverPage(state.search);
export const searchObjectTypesResults = state => fromSearch.searchObjectTypesResults(state.search);
export const getBeneficiariesUsers = state => fromSearch.getBeneficiariesUsers(state.search);
export const getIsStartSearchAutoComplete = state =>
  fromSearch.getIsStartSearchAutoComplete(state.search);
export const getIsStartSearchUser = state => fromSearch.getIsStartSearchUser(state.search);
export const getIsStartSearchObject = state => fromSearch.getIsStartSearchObject(state.search);
export const getIsClearSearchObjects = state => fromSearch.getIsClearSearchObjects(state.search);

export const getObject = state => fromObject.getObjectState(state.object);
export const getObjectFetchingState = state => fromObject.getObjectFetchingState(state.object);
export const getObjectAuthor = state => fromObject.getObjectAuthor(state.object);
export const getObjectAdmins = state => fromObject.getObjectAdmins(state.object);
export const getObjectModerators = state => fromObject.getObjectModerators(state.object);
export const getObjectFields = state => fromObject.getObjectFields(state.object);
export const getRatingFields = state => fromObject.getRatingFields(state.object);
export const getObjectTagCategory = state => fromObject.getObjectTagCategory(state.object);
export const getWobjectIsFailed = state => fromObject.getWobjectIsFailed(state.object);
export const getWobjectIsFatching = state => fromObject.getWobjectIsFatching(state.object);

export const getBreadCrumbs = state => fromObject.getBreadCrumbs(state.object);
export const getWobjectNested = state => fromObject.getWobjectNested(state.object);
export const getObjectLists = state => fromObject.getObjectLists(state.object);
export const getIsNestedWobject = state => fromObject.getIsNestedWobject(state.object);

export const getObjectTypesList = state => fromObjectTypes.getObjectTypesList(state.objectTypes);
export const getObjectTypesLoading = state =>
  fromObjectTypes.getObjectTypesLoading(state.objectTypes);

export const getObjectTypeState = state => fromObjectType.getObjectType(state.objectType);
export const getObjectTypeLoading = state => fromObjectType.getObjectTypeLoading(state.objectType);
export const getFilteredObjects = state => fromObjectType.getFilteredObjects(state.objectType);
export const getFilteredObjectsMap = state =>
  fromObjectType.getFilteredObjectsMap(state.objectType);

export const getUpdatedMapDiscover = state =>
  fromObjectType.getUpdatedMapDiscover(state.objectType);
export const getHasMoreRelatedObjects = state =>
  fromObjectType.getHasMoreRelatedObjects(state.objectType);
export const getAvailableFilters = state => fromObjectType.getAvailableFilters(state.objectType);
export const getActiveFilters = state => fromObjectType.getActiveFilters(state.objectType);
export const getTypeName = state => fromObjectType.getTypeName(state.objectType);
export const getHasMap = state => fromObjectType.getHasMap(state.objectType);
export const getObjectTypeSorting = state => fromObjectType.getSorting(state.objectType);
export const getFiltersTags = state => fromObjectType.getFiltersTags(state.objectType);
export const getActiveFiltersTags = state => fromObjectType.getActiveFiltersTags(state.objectType);

export const getIsAppendLoading = state => fromAppend.getIsAppendLoading(state.append);

export const getObjectAlbums = state => fromGallery.getObjectAlbums(state.gallery);
export const getIsObjectAlbumsLoading = state =>
  fromGallery.getIsObjectAlbumsLoading(state.gallery);

export const getIsMapModalOpen = state => fromMap.getIsMapModalOpen(state.map);
export const getObjectsMap = state => fromMap.getObjectsMap(state.map);
export const getUpdatedMap = state => fromMap.getUpdatedMap(state.map);

export const getSingleReportData = state => fromRewards.getSingleReportData(state.rewards);
export const getGlobalReportData = state => fromRewards.getGlobalReportData(state.rewards);
export const getTabType = state => fromRewards.getTabType(state.rewards);
export const getHasReceivables = state => fromRewards.getHasReceivables(state.rewards);
export const getCountTookPartCampaigns = state =>
  fromRewards.getCountTookPartCampaigns(state.rewards);
export const getCreatedCampaignsCount = state =>
  fromRewards.getCreatedCampaignsCount(state.rewards);
export const getCommentsFromReserved = state => fromRewards.getCommentsFromReserved(state.rewards);
export const getSponsorsRewards = state => fromRewards.getSponsorsRewards(state.rewards);
export const getFraudSuspicionDataState = state =>
  fromRewards.getFraudSuspicionDataState(state.rewards);
export const getHasMoreFollowingRewards = state =>
  fromRewards.getHasMoreFollowingRewards(state.rewards);
export const getHasMoreFraudSuspicionData = state =>
  fromRewards.getHasMoreFraudSuspicionData(state.rewards);
export const getIsLoading = state => fromRewards.getIsLoading(state.rewards);
export const getPropositionCampaign = state => fromRewards.getPropositionCampaign(state.rewards);
export const getIsLoadingPropositions = state =>
  fromRewards.getIsLoadingPropositions(state.rewards);

export const getCampaignServerPercent = state =>
  fromReferral.getCampaignServerPercent(state.referral);
export const getIndexAbsolutePercent = state =>
  fromReferral.getIndexAbsolutePercent(state.referral);
export const getIndexServerPercent = state => fromReferral.getIndexServerPercent(state.referral);
export const getReferralDuration = state => fromReferral.getReferralDuration(state.referral);
export const getReferralServerPercent = state =>
  fromReferral.getReferralServerPercent(state.referral);
export const getSuspendedTimer = state => fromReferral.getSuspendedTimer(state.referral);
export const getIsStartLoadingReferralDetails = state =>
  fromReferral.getIsStartLoadingReferralDetails(state.referral);
export const getIsUserInWaivioBlackList = state =>
  fromReferral.getIsUserInWaivioBlackList(state.referral);
export const getReferralStatus = state => fromReferral.getReferralStatus(state.referral);
export const getReferralList = state => fromReferral.getReferralList(state.referral);
export const getIsChangedRuleSelection = state =>
  fromReferral.getIsChangedRuleSelection(state.referral);
export const getIsUsersCards = state => fromReferral.getIsUsersCards(state.referral);
export const getIsHasMoreCards = state => fromReferral.getIsHasMoreCards(state.referral);
export const getCurrentUserCards = state => fromReferral.getCurrentUserCards(state.referral);
export const getIsErrorLoadingUserCards = state =>
  fromReferral.getIsErrorLoadingUserCards(state.referral);
export const getIsLoadingMoreUserCards = state =>
  fromReferral.getIsLoadingMoreUserCards(state.referral);
export const getIsStartChangeRules = state => fromReferral.getIsStartChangeRules(state.referral);
export const getIsStartGetReferralInfo = state =>
  fromReferral.getIsStartGetReferralInfo(state.referral);
export const getStatusSponsoredHistory = state =>
  fromReferral.getStatusSponsoredHistory(state.referral);

// common selectors

export const getCurrentLocation = state => state.router.location;
export const getQueryString = state => state.router.location.search;

export const getSuitableLanguage = state => {
  const settingsLocale = getLocale(state);
  if (settingsLocale !== 'auto') return settingsLocale;

  const usedLocale = getUsedLocale(state);
  return usedLocale || 'en-US';
};
