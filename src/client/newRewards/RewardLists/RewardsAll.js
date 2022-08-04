import React from 'react';
import { getAllRewardList, getFiltersForAllRewards } from '../../../waivioApi/ApiClient';
import RenderCampaingList from '../RenderCampaingList';

import './RewardLists.less';

const RewardsAll = () => (
  <RenderCampaingList
    getAllRewardList={getAllRewardList}
    getFilters={getFiltersForAllRewards}
    title={'All rewards'}
  />
);

export default RewardsAll;
