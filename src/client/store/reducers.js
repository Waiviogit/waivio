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
import walletReducer, * as fromWallet from '../wallet/walletReducer';
import reblogReducers from './reblogStore/reblogReducers';
import settingsReducer, * as fromSettings from '../settings/settingsReducer';
import searchReducer, * as fromSearch from '../search/searchReducer';
import wobjectReducer from './wObjectStore/wobjectReducer';
import objectTypesReducer from './objectTypesStore/objectTypesReducer';
import objectTypeReducer from './objectTypeStore/objectTypeReducer';
import appendReducer, * as fromAppend from '../object/appendReducer';
import galleryReducer, * as fromGallery from '../object/ObjectGallery/galleryReducer';
import mapReducer, * as fromMap from '../components/Maps/mapReducer';
import rewardsReducer, * as fromRewards from '../rewards/rewardsReducer';
import websiteReducer, * as fromWebsite from '../websites/websiteReducer';
import referralReducer, * as fromReferral from '../rewards/ReferralProgram/ReferralReducer';
import { getUsedLocale } from './appStore/appSelectors';

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

export const getIsTransferVisible = state => fromWallet.getIsTransferVisible(state.wallet);
export const getTransferTo = state => fromWallet.getTransferTo(state.wallet);
export const getTransferAmount = state => fromWallet.getTransferAmount(state.wallet);
export const getTransferCurrency = state => fromWallet.getTransferCurrency(state.wallet);
export const getTransferMemo = state => fromWallet.getTransferMemo(state.wallet);
export const getTransferApp = state => fromWallet.getTransferApp(state.wallet);
export const getTransferIsTip = state => fromWallet.getTransferIsTip(state.wallet);
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
export const getIsTransactionsHistoryLoading = state =>
  fromWallet.getIsTransactionsHistoryLoading(state.wallet);

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
export const getWebsiteSearchType = state => fromSearch.getWebsiteSearchType(state.search);
export const getWebsiteSearchResult = state => fromSearch.getWebsiteSearchResult(state.search);
export const getHasMoreObjects = state => fromSearch.getHasMoreObjects(state.search);
export const getHasMoreUsers = state => fromSearch.getHasMoreUsers(state.search);
export const getSearchFilters = state => fromSearch.getSearchFilters(state.search);
export const getWebsiteSearchString = state => fromSearch.getWebsiteSearchString(state.search);
export const getSearchFiltersTagCategory = state =>
  fromSearch.getSearchFiltersTagCategory(state.search);
export const getSearchSort = state => fromSearch.getSearchSort(state.search);
export const getWebsiteSearchResultLoading = state =>
  fromSearch.getWebsiteSearchResultLoading(state.search);
export const getShowSearchResult = state => fromSearch.getShowSearchResult(state.search);
export const getAllSearchLoadingMore = state => fromSearch.getAllSearchLoadingMore(state.search);
export const getWebsiteMap = state => fromSearch.getWebsiteMap(state.search);
export const getHasMoreObjectsForWebsite = state =>
  fromSearch.getHasMoreObjectsForWebsite(state.search);
export const getSearchInBox = state => fromSearch.getSearchInBox(state.search);

export const getIsAppendLoading = state => fromAppend.getIsAppendLoading(state.append);

export const getObjectAlbums = state => fromGallery.getObjectAlbums(state.gallery);
export const getIsObjectAlbumsLoading = state =>
  fromGallery.getIsObjectAlbumsLoading(state.gallery);
export const getRelatedPhotos = state => fromGallery.getRelatedPhotos(state.gallery);

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
export const getIsLoadingRewardsHistory = state =>
  fromRewards.getIsLoadingRewardsHistory(state.rewards);
export const getCampaignNames = state => fromRewards.getCampaignNames(state.rewards);
export const getHistoryCampaigns = state => fromRewards.getHistoryCampaigns(state.rewards);
export const getHistorySponsors = state => fromRewards.getHistorySponsors(state.rewards);
export const getHasMoreHistory = state => fromRewards.getHasMoreHistory(state.rewards);
export const getIsOpenWriteReviewModal = state =>
  fromRewards.getIsOpenWriteReviewModal(state.rewards);
export const getExpiredPayment = state => fromRewards.getExpiredPayment(state.rewards);

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
