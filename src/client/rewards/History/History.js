import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { get, map, size } from 'lodash';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import FilteredRewardsList from '../FilteredRewardsList';
import {
  getBlacklist,
  getMoreRewardsHistory,
  getRewardsHistory,
} from '../../../store/rewardsStore/rewardsActions';
import {
  REWARDS_TYPES_MESSAGES,
  CAMPAIGNS_TYPES_MESSAGES,
  PATH_NAME_GUIDE_HISTORY,
  PATH_NAME_HISTORY,
} from '../../../common/constants/rewards';
import { pathNameHistoryNotify } from '../rewardsHelper';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import {
  getCampaignNames,
  getHasMoreHistory,
  getHistoryCampaigns,
  getHistorySponsors,
  getIsLoadingRewardsHistory,
} from '../../../store/rewardsStore/rewardsSelectors';

const History = ({
  intl,
  campaignsLayoutWrapLayout,
  activeMessagesFilters,
  activeHistoryFilters,
  activeGuideHistoryFilters,
  messagesSponsors,
  messagesCampaigns,
  setMessagesSponsors,
  setMessagesCampaigns,
  match,
  usedLocale,
  setSortValue,
  sortHistory,
  sortMessages,
  sortGuideHistory,
  setActiveMessagesFilters,
  location,
  getUserBlackList,
  userName,
  getCurrentRewardsHistory,
  isLoadingHistory,
  campaignNames,
  historyCampaigns,
  historySponsors,
  hasMoreHistory,
  getMoreHistory,
}) => {
  const isHistory = location.pathname === PATH_NAME_HISTORY;
  const isHistoryNotify = location.pathname === pathNameHistoryNotify(match);
  const isGuideHistory = location.pathname === PATH_NAME_GUIDE_HISTORY;
  const [loading, setLoading] = useState(false);
  const [blacklistUsers, setBlacklistUsers] = useState([]);
  const [loadingCampaigns, setLoadingCampaigns] = useState(false);

  const sortForFilters = useMemo(() => {
    if (isHistory) {
      return sortHistory;
    } else if (isGuideHistory) {
      return sortGuideHistory;
    }

    return sortMessages;
  }, [isHistory, isGuideHistory, sortHistory, sortGuideHistory, sortMessages]);

  const reservationPermlink = match.params.campaignId;
  const currentNotifyAuthor = match.params.username;

  const getHistory = (username, sortChanged, activeFilters, isLoadMore = false) => {
    const rewards = map(activeFilters.rewards, item =>
      Object.keys(REWARDS_TYPES_MESSAGES).find(key => REWARDS_TYPES_MESSAGES[key] === item),
    );

    const caseStatus = Object.keys(CAMPAIGNS_TYPES_MESSAGES).find(
      key => CAMPAIGNS_TYPES_MESSAGES[key] === activeFilters.caseStatus,
    );

    const requestData = {
      onlyWithMessages: true,
      sort: sortChanged,
      rewards,
      status: activeFilters.status,
      locale: usedLocale,
    };

    if (isHistory) {
      requestData.guideNames = activeFilters.messagesSponsors;
      requestData.userName = username;
    }

    if (!isHistory) {
      requestData.caseStatus = caseStatus;
      requestData.guideName = username;
      requestData.reservationPermlink = reservationPermlink;
    }

    if (isHistoryNotify) {
      requestData.notifyAuthor = currentNotifyAuthor;
    }

    if (isGuideHistory) {
      requestData.guideName = username;
      requestData.campaignNames = activeFilters.messagesCampaigns;
      requestData.onlyWithMessages = false;
    }

    if (!isLoadMore) {
      setLoadingCampaigns(true);
      getCurrentRewardsHistory(requestData).then(() => setLoadingCampaigns(false));
    } else {
      requestData.skip = size(historyCampaigns);
      getMoreHistory(requestData);
    }
  };

  useEffect(() => {
    if (!isLoadingHistory) {
      setMessagesSponsors(historySponsors);
      setMessagesCampaigns(campaignNames);
      setLoading(false);
    }
  }, [isLoadingHistory]);

  const filters = useMemo(() => {
    if (isHistory) {
      return activeHistoryFilters;
    } else if (isGuideHistory) {
      return activeGuideHistoryFilters;
    }

    return activeMessagesFilters;
  }, [
    isHistory,
    isGuideHistory,
    activeHistoryFilters,
    activeGuideHistoryFilters,
    activeMessagesFilters,
  ]);

  const handleSortChange = useCallback(
    sortChanged => {
      setLoadingCampaigns(true);
      setSortValue(sortChanged);
      getHistory(userName, sortChanged, filters);
    },
    [setSortValue, getHistory, userName, filters],
  );

  useEffect(() => {
    if (userName) getHistory(userName, sortForFilters, filters);
    if (!isHistory) {
      getUserBlackList(userName).then(data => {
        const blacklist = get(data, ['value', 'blackList', 'blackList']);
        const blacklistNames = map(blacklist, user => user.name);

        setBlacklistUsers(blacklistNames);
      });
    }
  }, [
    JSON.stringify(activeMessagesFilters),
    JSON.stringify(activeHistoryFilters),
    JSON.stringify(activeGuideHistoryFilters),
    location.pathname,
    userName,
  ]);

  const handleLoadMore = () => {
    if (hasMoreHistory && !isLoadingHistory) {
      getHistory(userName, sortForFilters, filters, true);
    }
  };

  return (
    <div className="history">
      <FilteredRewardsList
        {...{
          intl,
          match,
          campaignsLayoutWrapLayout,
          loadingCampaigns,
          loading,
          hasMore: hasMoreHistory,
          messages: historyCampaigns,
          handleSortChange,
          sponsors: messagesSponsors,
          messagesCampaigns,
          tabType: 'history',
          location: location.pathname,
          sortHistory,
          sortMessages,
          sortGuideHistory,
          activeMessagesFilters,
          userName,
          getHistory,
          handleLoadMore,
          blacklistUsers,
          activeHistoryFilters,
          activeGuideHistoryFilters,
          setActiveMessagesFilters,
        }}
      />
    </div>
  );
};

History.propTypes = {
  intl: PropTypes.shape().isRequired,
  campaignsLayoutWrapLayout: PropTypes.func.isRequired,
  location: PropTypes.shape().isRequired,
  match: PropTypes.shape().isRequired,
  activeMessagesFilters: PropTypes.shape().isRequired,
  activeHistoryFilters: PropTypes.shape().isRequired,
  activeGuideHistoryFilters: PropTypes.shape().isRequired,
  messagesSponsors: PropTypes.arrayOf(PropTypes.string),
  messagesCampaigns: PropTypes.arrayOf(PropTypes.string),
  setMessagesSponsors: PropTypes.func.isRequired,
  setMessagesCampaigns: PropTypes.func.isRequired,
  setSortValue: PropTypes.func,
  sortHistory: PropTypes.string,
  sortGuideHistory: PropTypes.string,
  sortMessages: PropTypes.string,
  setActiveMessagesFilters: PropTypes.func,
  getUserBlackList: PropTypes.func,
  usedLocale: PropTypes.string,
  userName: PropTypes.string,
  isLoadingHistory: PropTypes.bool,
  campaignNames: PropTypes.shape(),
  historyCampaigns: PropTypes.shape(),
  historySponsors: PropTypes.shape(),
  hasMoreHistory: PropTypes.bool,
  getCurrentRewardsHistory: PropTypes.func,
  getMoreHistory: PropTypes.func,
};

History.defaultProps = {
  setSortValue: () => {},
  sortHistory: 'reservation',
  sortMessages: 'inquiryDate',
  sortGuideHistory: 'reservation',
  messagesSponsors: [],
  messagesCampaigns: [],
  usedLocale: 'en-US',
  setActiveMessagesFilters: () => {},
  getUserBlackList: () => {},
  userName: '',
  isLoadingHistory: false,
  campaignNames: [],
  historyCampaigns: [],
  historySponsors: [],
  hasMoreHistory: false,
  getCurrentRewardsHistory: () => {},
  getMoreHistory: () => {},
};

const mapStateToProps = state => ({
  userName: getAuthenticatedUserName(state),
  isLoadingHistory: getIsLoadingRewardsHistory(state),
  campaignNames: getCampaignNames(state),
  historyCampaigns: getHistoryCampaigns(state),
  historySponsors: getHistorySponsors(state),
  hasMoreHistory: getHasMoreHistory(state),
});

const mapDispatchToProps = {
  getUserBlackList: getBlacklist,
  getCurrentRewardsHistory: getRewardsHistory,
  getMoreHistory: getMoreRewardsHistory,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(injectIntl(History)));
