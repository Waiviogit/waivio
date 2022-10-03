import React from 'react';
import { getFiltersForMessages, getMessagesList } from '../../../waivioApi/ApiClient';
import RenderPropositionList from '../PropositionList/RenderPropositionList';

import '../RewardLists/RewardLists.less';

const filterConfig = [
  { title: 'Rewards', type: 'statuses' },
  { title: 'Campaign', type: 'campaignNames' },
];

const sortConfig = [
  { key: 'inquiryDate', title: 'Inquiry date' },
  { key: 'latest', title: 'Latest' },
  { key: 'reservation', title: 'Reservation' },
];

const MessageList = () => {
  const getPropositionReservedPropos = (obj, userName, skip, search, sort) =>
    getMessagesList(userName, skip, search, sort);

  return (
    <RenderPropositionList
      getProposition={getPropositionReservedPropos}
      getPropositionFilters={getFiltersForMessages}
      customFilterConfig={filterConfig}
      customSortConfig={sortConfig}
      defaultSort={'inquiryDate'}
      tab={'messages'}
    />
  );
};

export default MessageList;
