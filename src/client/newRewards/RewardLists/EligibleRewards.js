import React from 'react';
import { useSelector } from 'react-redux';

import {
  getEligibleRewardList,
  getFiltersForEligibleRewards,
  getMarkersForEligible,
} from '../../../waivioApi/ApiClient';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import RenderCampaingList from './RenderCampaingList';

const EligibleRewards = () => {
  const userName = useSelector(getAuthenticatedUserName);
  const getAllRewardList = (skip, query, sort) =>
    getEligibleRewardList(userName, skip, query, sort);
  const getFilters = () => getFiltersForEligibleRewards(userName);

  return (
    <RenderCampaingList
      getAllRewardList={getAllRewardList}
      title={'Eligible rewards'}
      getFilters={getFilters}
      getMapItems={getMarkersForEligible}
    />
  );
};

export default EligibleRewards;
