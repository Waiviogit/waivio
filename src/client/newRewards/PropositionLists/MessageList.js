import React from 'react';
import { getFiltersForMessages, getMessagesList } from '../../../waivioApi/ApiClient';
import RenderPropositionList from '../PropositionList/RenderPropositionList';

import '../RewardLists/RewardLists.less';

const filterConfig = [
  { title: 'Rewards', type: 'statuses' },
  { title: 'Campaign', type: 'campaignNames' },
];

const MessageList = () => {
  const getPropositionReservedPropos = (obj, userName, skip, search) =>
    getMessagesList(userName, skip, search);

  return (
    <RenderPropositionList
      getProposition={getPropositionReservedPropos}
      getPropositionFilters={getFiltersForMessages}
      customFilterConfig={filterConfig}
      tab={'messages'}
    />
  );
};

export default MessageList;
