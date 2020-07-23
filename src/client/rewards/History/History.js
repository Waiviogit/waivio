import React, { useEffect, useState, useCallback } from 'react';
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
  messagesSponsors,
  setMessagesSponsors,
  match,
  setSortValue,
  sortHistory,
  sortMessages,
}) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const isHistory = location.pathname === '/rewards/history';

  const [loadingCampaigns, setLoadingCampaigns] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [blacklistUsers, setBlacklistUsers] = useState([]);
  const userName = useSelector(getAuthenticatedUserName);
  const sort = isHistory ? sortHistory : sortMessages;
  const useLoader = true;

  const getHistory = useCallback(
    async (username, sortChanged, activeFilters, withLoader, loadMore = false) => {
      const rewards = map(activeFilters.rewards, item =>
        Object.keys(REWARDS_TYPES_MESSAGES).find(key => REWARDS_TYPES_MESSAGES[key] === item),
      );
      const caseStatus = Object.keys(CAMPAIGNS_TYPES_MESSAGES).find(
        key => CAMPAIGNS_TYPES_MESSAGES[key] === activeFilters.caseStatus,
      );
      try {
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

        if (withLoader) {
          await setLoadingCampaigns(true);
        }
        const data = await ApiClient.getHistory(requestData);
        setLoadingCampaigns(false);
        setMessages(loadMore ? messages.concat(data.campaigns) : data.campaigns);
        setMessagesSponsors(uniq(messagesSponsors.concat(data.sponsors)));
        setLoading(false);
        setHasMore(data.hasMore);
      } finally {
        await setLoadingCampaigns(false);
      }
    },
    [
      JSON.stringify(activeMessagesFilters),
      JSON.stringify(activeHistoryFilters),
      messagesSponsors,
      hasMore,
      messagesSponsors,
    ],
  );

  const handleSortChange = useCallback(
    sortChanged => {
      setLoadingCampaigns(true);
      setSortValue(sortChanged);
      getHistory(
        userName,
        sortChanged,
        isHistory ? activeHistoryFilters : activeMessagesFilters,
        useLoader,
      );
    },
    [userName, activeMessagesFilters, activeHistoryFilters],
  );

  useEffect(() => {
    const sortForFilters = isHistory ? sortHistory : sortMessages;
    getHistory(
      userName,
      sortForFilters,
      isHistory ? activeHistoryFilters : activeMessagesFilters,
      useLoader,
    );
    if (!isHistory) {
      dispatch(getBlacklist(userName)).then(data => {
        const blacklist = get(data, ['value', 'blackList', 'blackList']);
        const blacklistNames = map(blacklist, user => user.name);
        setBlacklistUsers(blacklistNames);
      });
    }
  }, [JSON.stringify(activeMessagesFilters), JSON.stringify(activeHistoryFilters)]);

  const handleLoadMore = () => {
    if (hasMore) {
      setLoading(true);
      const sortForFilters = isHistory ? sortHistory : sortMessages;
      getHistory(userName, sortForFilters, activeMessagesFilters, false, true);
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
          hasMore,
          messages,
          handleSortChange,
          sort,
          sponsors: messagesSponsors,
          filterKey: 'history',
          location: location.pathname,
          sortHistory,
          sortMessages,
          activeMessagesFilters,
          userName,
          getHistory,
          handleLoadMore,
          blacklistUsers,
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
  messagesSponsors: PropTypes.arrayOf(PropTypes.string).isRequired,
  setMessagesSponsors: PropTypes.func.isRequired,
  setSortValue: PropTypes.func,
  sortHistory: PropTypes.string,
  sortMessages: PropTypes.string,
  setActiveMessagesFilters: PropTypes.func,
};

History.defaultProps = {
  setSortValue: () => {},
  sortHistory: 'reservation',
  sortMessages: 'inquiryDate',
  setActiveMessagesFilters: () => {},
};

export default injectIntl(History);
