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
}) => {
  const location = useLocation();
  const isHistory = location.pathname === '/rewards/history';
  const [sort, setSort] = useState(isHistory ? 'reservation' : 'inquiryDate');
  const [loadingCampaigns, setLoadingCampaigns] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  const userName = useSelector(getAuthenticatedUserName);

  const getHistory = useCallback(
    async (username, sortHistory, activeFilters) => {
      const requestData = {
        onlyWithMessages: true,
        sort: sortHistory,
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
        setSort(sortHistory);
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
    sortHistory => {
      setLoadingCampaigns(true);
      setSort(sortHistory);
      getHistory(userName, sortHistory, activeMessagesFilters);
    },
    [userName, activeMessagesFilters],
  );

  useEffect(() => {
    getHistory(userName, sort, activeMessagesFilters);
  }, [JSON.stringify(activeMessagesFilters)]);

  return (
    <div className="history">
      <FilteredRewardsList
        {...{
          intl,
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
};

export default injectIntl(History);
