import React from 'react';
import { useSelector } from 'react-redux';
import {injectIntl} from "react-intl";
import PropTypes from "prop-types";

import {
  getEligibleRewardList,
  getFiltersForEligibleRewards,
  getMarkersForEligible,
} from '../../../waivioApi/ApiClient';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import RenderCampaingList from './RenderCampaingList';

const EligibleRewards = ({ intl }) => {
  const userName = useSelector(getAuthenticatedUserName);
  const getAllRewardList = (skip, query, sort) =>
    getEligibleRewardList(userName, skip, query, sort);
  const getFilters = () => getFiltersForEligibleRewards(userName);

  return (
    <RenderCampaingList
      getAllRewardList={getAllRewardList}
      title={intl.formatMessage({ id: "eligible_rewards", defaultMessage: "Eligible rewards" })}
      getFilters={getFilters}
      getMapItems={getMarkersForEligible}
    />
  );
};

EligibleRewards.propTypes = {
  intl: PropTypes.shape().isRequired,
}

export default injectIntl(EligibleRewards);
