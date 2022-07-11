import React from 'react';
import { getAllRewardList } from '../../../waivioApi/ApiClient';
import RenderCampaingList from '../RenderCampaingList';

const RewardsAll = () => (
  <div>
    <h2>All rewards</h2>
    <RenderCampaingList getAllRewardList={getAllRewardList} />
  </div>
);

export default RewardsAll;
