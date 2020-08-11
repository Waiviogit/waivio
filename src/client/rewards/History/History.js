import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { get, map, uniq } from 'lodash';
import { injectIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import FilteredRewardsList from '../FilteredRewardsList';
import { getBlacklist } from '../rewardsActions';
import * as ApiClient from '../../../waivioApi/ApiClient';
import { getAuthenticatedUserName } from '../../reducers';
import {
  REWARDS_TYPES_MESSAGES,
  CAMPAIGNS_TYPES_MESSAGES,
} from '../../../common/constants/rewards';

const History = ({
  intl,
  campaignsLayoutWrapLayout,
  activeMessagesFilters,
  activeHistoryFilters,
  activeGuideHistoryFilters,
  messagesSponsors,
  setMessagesSponsors,
  match,
  setSortValue,
  sortHistory,
  sortMessages,
  sortGuideHistory,
  setActiveMessagesFilters,
}) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const isHistory = location.pathname === '/rewards/history';
  const isGuideHistory = location.pathname === '/rewards/guideHistory';

  const [loadingCampaigns, setLoadingCampaigns] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [blacklistUsers, setBlacklistUsers] = useState([]);
  const userName = useSelector(getAuthenticatedUserName);
  const useLoader = true;
  const sortForFilters = useMemo(() => {
    if (isHistory) {
      return sortHistory;
    } else if (isGuideHistory) {
      return sortGuideHistory;
    }
    return sortMessages;
  }, [isHistory, isGuideHistory, sortHistory, sortGuideHistory, sortMessages]);

  const getHistory = useCallback(
    async (username, sortChanged, activeFilters, withLoader, loadMore = false) => {
      const rewards = map(activeFilters.rewards, item =>
        Object.keys(REWARDS_TYPES_MESSAGES).find(key => REWARDS_TYPES_MESSAGES[key] === item),
      );
      const caseStatus = Object.keys(CAMPAIGNS_TYPES_MESSAGES).find(
        key => CAMPAIGNS_TYPES_MESSAGES[key] === activeFilters.caseStatus,
      );
      try {
        setHasMore(false);
        const requestData = {
          onlyWithMessages: true,
          sort: sortChanged,
          rewards,
          status: activeFilters.status,
        };
        requestData.skip = loadMore ? messages.length : 0;
        if (isHistory) {
          requestData.guideNames = activeFilters.messagesSponsors;
          requestData.userName = username;
        }
        if (!isHistory) {
          requestData.caseStatus = caseStatus;
          requestData.guideName = username;
        }
        if (isGuideHistory) {
          requestData.guideName = username;
          requestData.guideNames = activeFilters.messagesSponsors;
          requestData.onlyWithMessages = false;
        }

        if (withLoader) {
          await setLoadingCampaigns(true);
        }
        const data = await ApiClient.getHistory(requestData);
        setLoadingCampaigns(false);
        setMessages(loadMore ? messages.concat(data.campaigns) : data.campaigns);
        setMessagesSponsors(
          !isGuideHistory ? uniq(messagesSponsors.concat(data.sponsors)) : data.sponsors,
        );
        setLoading(false);
        setHasMore(data.hasMore);
      } finally {
        await setLoadingCampaigns(false);
      }
    },
    [
      JSON.stringify(activeMessagesFilters),
      JSON.stringify(activeHistoryFilters),
      JSON.stringify(activeGuideHistoryFilters),
      messagesSponsors,
      hasMore,
      messagesSponsors,
    ],
  );

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
      getHistory(userName, sortChanged, filters, useLoader);
    },
    [setSortValue, getHistory, userName, filters, useLoader],
  );

  useEffect(() => {
    getHistory(userName, sortForFilters, filters, useLoader);
    if (!isHistory) {
      dispatch(getBlacklist(userName)).then(data => {
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
  ]);

  const handleLoadMore = useCallback(() => {
    if (hasMore) {
      setLoading(true);
      getHistory(userName, sortForFilters, filters, false, true);
    }
  }, [filters, getHistory, hasMore, sortForFilters, userName]);

  return (
    <div className="history">
      <FilteredRewardsList
        {...{
          intl,
          match,
          campaignsLayoutWrapLayout,
          loadingCampaigns,
          loading,
          hasMore,
          messages,
          handleSortChange,
          sponsors: messagesSponsors,
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
  setMessagesSponsors: PropTypes.func.isRequired,
  setSortValue: PropTypes.func,
  sortHistory: PropTypes.string,
  sortGuideHistory: PropTypes.string,
  sortMessages: PropTypes.string,
  setActiveMessagesFilters: PropTypes.func,
};

History.defaultProps = {
  setSortValue: () => {},
  sortHistory: 'reservation',
  sortMessages: 'inquiryDate',
  sortGuideHistory: 'reservation',
  messagesSponsors: [],
  setActiveMessagesFilters: () => {},
};

export default injectIntl(History);
