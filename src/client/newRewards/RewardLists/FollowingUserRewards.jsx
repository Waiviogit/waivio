import React from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';

import RenderCampaingList from './RenderCampaingList';
import { getRewardsFollowerUser } from '../../../waivioApi/ApiClient';

const FollowingUserRewards = ({ intl }) => (
  <RenderCampaingList
    getAllRewardList={getRewardsFollowerUser}
    title={intl.formatMessage({
      id: 'rewards_from_sponsors_you_are_following',
      defaultMessage: 'Rewards from the sponsors you are following',
    })}
    withoutFilters
    emptyMessage={`${intl.formatMessage({
      id: 'no_rewards_posted_by_sponsors_you_are_following',
      defaultMessage: 'No rewards posted by the sponsors you are following',
    })}.`}
  />
);

FollowingUserRewards.propTypes = {
  intl: PropTypes.shape().isRequired,
};

export default injectIntl(FollowingUserRewards);
