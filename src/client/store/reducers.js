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
