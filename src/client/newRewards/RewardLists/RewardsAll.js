import React from 'react';
import {
  getAllRewardList,
  getFiltersForAllRewards,
  getMarkersForAll,
} from '../../../waivioApi/ApiClient';
import RenderCampaingList from './RenderCampaingList';

import './RewardLists.less';

const RewardsAll = () => (
  <RenderCampaingList
    getAllRewardList={getAllRewardList}
    getFilters={getFiltersForAllRewards}
    getMapItems={getMarkersForAll}
    title={'All rewards'}
  />
);

export default RewardsAll;
