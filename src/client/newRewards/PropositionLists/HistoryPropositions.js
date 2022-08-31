import React from 'react';
import RenderPropositionList from '../PropositionList/RenderPropositionList';
import { getFiltersForHistoryProposition, getHistoryList } from '../../../waivioApi/ApiClient';

const filterConfig = [
  { title: 'Rewards', type: 'statuses' },
  { title: 'Campaign', type: 'campaignNames' },
];

const HistoryPropositions = () => {
  const getPropositionReservedPropos = (obj, userName, skip, search) =>
    getHistoryList(userName, skip, search);

  return (
    <RenderPropositionList
      getProposition={getPropositionReservedPropos}
      getPropositionFilters={getFiltersForHistoryProposition}
      customFilterConfig={filterConfig}
      tab={'history'}
    />
  );
};

export default HistoryPropositions;
