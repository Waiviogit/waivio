import React from 'react';
import { useSelector } from 'react-redux';

import { getEligibleRewardList } from '../../../waivioApi/ApiClient';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import RenderCampaingList from '../RenderCampaingList';

const EligibleRewards = () => {
  const userName = useSelector(getAuthenticatedUserName);
  const getAllRewardList = skip => getEligibleRewardList(userName, skip);

  return (
    <React.Fragment>
      <h2>Eligible rewards</h2>
      <RenderCampaingList getAllRewardList={getAllRewardList} />
    </React.Fragment>
  );
};

export default EligibleRewards;
