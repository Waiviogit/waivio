import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { map, isEmpty } from 'lodash';
import { getFollowingSponsorsRewards } from '../rewardsActions';
import Campaign from '../Campaign/Campaign';
import { getAuthenticatedUserName } from '../../reducers';
import './RewardsList.less';

const RewardsList = ({ intl }) => {
  const dispatch = useDispatch();
  const userName = useSelector(getAuthenticatedUserName);
  const [followingRewards, setFollowingRewards] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    dispatch(getFollowingSponsorsRewards()).then(data => {
      const { campaigns } = data.value;
      setFollowingRewards(campaigns);
      setLoading(false);
    });
  }, []);
  const content = useMemo(() => {
    if (!isEmpty(followingRewards)) {
      return (
        <React.Fragment>
          {map(followingRewards, reward => (
            <Campaign
              proposition={reward}
              key={`${reward.required_object.author_permlink}${reward.required_object.createdAt}`}
              filterKey={'all'}
              userName={userName}
            />
          ))}
        </React.Fragment>
      );
    } else if (isEmpty(followingRewards) && !loading) {
      return (
        <div className="RewardsList__message">
          {intl.formatMessage({
            id: 'no_rewards_posted_by_sponsors_you_are_following',
            defaultMessage: 'No rewards posted by the sponsors you are following',
          })}
        </div>
      );
    }
    return null;
  }, [followingRewards, loading]);
  return (
    <React.Fragment>
      <div className="RewardsList">
        <span className="RewardsList__title">
          {intl.formatMessage({
            id: 'rewards_from_sponsors_you_are_following',
            defaultMessage: 'Rewards from the sponsors you are following:',
          })}
        </span>
        {content}
      </div>
    </React.Fragment>
  );
};

RewardsList.propTypes = {
  intl: PropTypes.shape().isRequired,
};

export default injectIntl(RewardsList);
