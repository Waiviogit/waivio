import React from 'react';
import {injectIntl} from "react-intl";
import PropTypes from "prop-types";
import {
  getAllRewardList,
  getFiltersForAllRewards,
  getMarkersForAll,
} from '../../../waivioApi/ApiClient';
import RenderCampaingList from './RenderCampaingList';

import './RewardLists.less';

const RewardsAll = ({ intl }) => (
  <RenderCampaingList
    getAllRewardList={getAllRewardList}
    getFilters={getFiltersForAllRewards}
    getMapItems={getMarkersForAll}
    title={intl.formatMessage({ id: "all_rewards", defaultMessage: "All rewards" })}
  />
);

RewardsAll.propTypes = {
  intl: PropTypes.shape().isRequired,
}

export default injectIntl(RewardsAll);
