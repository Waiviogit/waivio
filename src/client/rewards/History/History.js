import React, { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { map, uniqBy } from 'lodash';
import { injectIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import FilteredRewardsList from '../FilteredRewardsList';
import * as ApiClient from '../../../waivioApi/ApiClient';
import { getAuthenticatedUserName } from '../../reducers';

const History = ({
  intl,
  campaignsLayoutWrapLayout,
  activeMessagesFilters,
  messagesSponsors,
  setMessagesSponsors,
  match,
  setSortValue,
  sortHistory,
  sortMessages,
}) => {
  const location = useLocation();
  const isHistory = location.pathname === '/rewards/history';

  const [loadingCampaigns, setLoadingCampaigns] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const userName = useSelector(getAuthenticatedUserName);
  const sort = isHistory ? sortHistory : sortMessages;

  const getHistory = useCallback(
    async (username, sortChanged, activeFilters) => {
      const requestData = {
        onlyWithMessages: true,
        sort: sortChanged,
        rewards: activeFilters.rewards,
        status: activeFilters.status,
        userName: username,
      };
      if (isHistory) requestData.guideNames = activeFilters.messagesSponsors;
      if (!isHistory) requestData.caseStatus = activeFilters.caseStatus;
      await setLoadingCampaigns(true);
      await ApiClient.getHistory(requestData).then(data => {
        const sponsors = map(uniqBy(data.campaigns, 'guideName'), campaign => campaign.guideName);
        setLoadingCampaigns(false);
        setMessages(data.campaigns || []);
        setMessagesSponsors(sponsors);
        setLoading(false);
        setHasMore(data.hasMore);
      });
      await setLoadingCampaigns(false);
    },
    [JSON.stringify(activeMessagesFilters), messagesSponsors],
  );

  const handleSortChange = useCallback(
    sortChanged => {
      setLoadingCampaigns(true);
      setSortValue(sortChanged);
      getHistory(userName, sortChanged, activeMessagesFilters);
    },
    [userName, activeMessagesFilters],
  );

  useEffect(() => {
    const sortForFilters = isHistory ? sortHistory : sortMessages;
    getHistory(userName, sortForFilters, activeMessagesFilters);
  }, [JSON.stringify(activeMessagesFilters)]);

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
  sortMessages: 'inquiry date',
  setActiveMessagesFilters: () => {},
};

export default injectIntl(History);
