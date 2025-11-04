import React from 'react';
import { getFraudDetectionList } from '../../../waivioApi/ApiClient';
import RenderPropositionList from '../PropositionList/RenderPropositionList';

import '../RewardLists/RewardLists.less';

const filterConfig = [
  { title: 'Rewards', type: 'statuses' },
  { title: 'Campaign', type: 'campaignNames' },
];

const sortConfig = [
  { key: 'reservation', title: 'Reservation' },
  { key: 'lastAction', title: 'Action (date)' },
];

const FraudDetection = () => {
  const getPropositionReservedPropos = (obj, userName, skip, search, sort) =>
    getFraudDetectionList(userName, skip, search, sort);

  return (
    <div className="FraudDetection">
      <RenderPropositionList
        getProposition={getPropositionReservedPropos}
        withoutFilters
        customFilterConfig={filterConfig}
        tab={'fraud'}
        customSortConfig={sortConfig}
        defaultSort={'reservation'}
        disclaimer={
          'This is an experimental service with limited capabilities and is provided "as is", without any guarantees regarding its effectiveness in identifying potential fraud attempts. All submissions must be manually reviewed and verified by the campaign sponsor.'
        }
      />
    </div>
  );
};

export default FraudDetection;
