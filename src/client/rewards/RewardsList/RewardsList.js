import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { map, get } from 'lodash';
import { getFollowingSponsorsRewards } from '../rewardsActions';
import ObjectCardView from '../../objectCard/ObjectCardView';
import './RewardsList.less';

const RewardsList = ({ intl }) => {
  const dispatch = useDispatch();
  const [followingRewards, setFollowingRewards] = useState([]);
  useEffect(() => {
    dispatch(getFollowingSponsorsRewards()).then(data => {
      console.log('data', data);
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

      {map(followingRewards, reward => {
        const rewardId = get(reward, ['required_object', '_id']);
        const wObject = get(reward, ['required_object']);
        const parent = get(reward, ['required_object', 'parent']);
        return (
          <React.Fragment>
            <div className="RewardsList__header" />
            <ObjectCardView key={rewardId} wObject={wObject} passedParent={parent} />
          </React.Fragment>
        );
      })}
    </div>
  );
};

RewardsList.propTypes = {
  intl: PropTypes.shape().isRequired,
};

export default injectIntl(RewardsList);
