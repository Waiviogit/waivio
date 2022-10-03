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
          ' It is an experimental service with a limited scope and is provided "as is" with no guarantee of applicability for the detection of probable fraud attempts. All submissions must always be manually verified and confirmed by the campaign sponsor'
        }
      />
    </div>
  );
};

export default FraudDetection;
