import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { map } from 'lodash';
import { getFollowingSponsorsRewards } from '../rewardsActions';
import Campaign from '../Campaign/Campaign';
import { getAuthenticatedUserName } from '../../reducers';
import './RewardsList.less';

const RewardsList = ({ intl }) => {
  const dispatch = useDispatch();
  const userName = useSelector(getAuthenticatedUserName);
  const [followingRewards, setFollowingRewards] = useState([]);
  useEffect(() => {
    dispatch(getFollowingSponsorsRewards()).then(data => {
      const { campaigns } = data.value;
      setFollowingRewards(campaigns);
    });
  }, []);
  return (
    <div className="RewardsList">
      {intl.formatMessage({
        id: 'rewards_from_sponsors_you_are_following',
        defaultMessage: 'Rewards from the sponsors you are following:',
      })}

      {map(followingRewards, reward => (
        <Campaign
          proposition={reward}
          key={`${reward.required_object.author_permlink}${reward.required_object.createdAt}`}
          userName={userName}
        />
      ))}
    </div>
  );
};

RewardsList.propTypes = {
  intl: PropTypes.shape().isRequired,
};

export default injectIntl(RewardsList);
