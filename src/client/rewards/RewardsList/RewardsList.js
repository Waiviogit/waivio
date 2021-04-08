import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { map, isEmpty } from 'lodash';
import {
  getFollowingSponsorsRewards,
  clearFollowingSponsorsRewards,
} from '../../store/rewardsStore/rewardsActions';
import Campaign from '../Campaign/Campaign';
import Loading from '../../components/Icon/Loading';
import ReduxInfiniteScroll from '../../vendor/ReduxInfiniteScroll';
import { getAuthenticatedUserName } from '../../store/authStore/authSelectors';
import {
  getHasMoreFollowingRewards,
  getIsLoading,
  getSponsorsRewards,
} from '../../store/rewardsStore/rewardsSelectors';

import './RewardsList.less';

const RewardsList = ({
  intl,
  userName,
  getFollowingRewards,
  clearFollowingRewards,
  followingRewards,
  hasMoreFollowingRewards,
  loading,
}) => {
  useEffect(() => {
    getFollowingRewards();

    return () => {
      clearFollowingRewards();
    };
  }, []);

  const handleLoadMore = () => {
    if (hasMoreFollowingRewards) {
      const skip = followingRewards.length;

      getFollowingRewards(skip);
    }
  };
  const content = useMemo(() => {
    if (!userName && loading) {
      return <Loading />;
    }

    if (!loading && isEmpty(followingRewards)) {
      return (
        <div className="RewardsList__message">
          {intl.formatMessage({
            id: 'no_rewards_posted_by_sponsors_you_are_following',
            defaultMessage: 'No rewards posted by the sponsors you are following',
          })}
        </div>
      );
    }

    return (
      <React.Fragment>
        <ReduxInfiniteScroll
          elementIsScrollable={false}
          hasMore={hasMoreFollowingRewards}
          loadMore={handleLoadMore}
          loadingMore={loading}
          loader={<Loading />}
        >
          {map(followingRewards, reward => (
            <Campaign
              proposition={reward}
              key={`${reward.required_object.author_permlink}${reward.required_object.createdAt}`}
              filterKey={'all'}
              userName={userName}
            />
          ))}
        </ReduxInfiniteScroll>
      </React.Fragment>
    );
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
  userName: PropTypes.string,
  getFollowingRewards: PropTypes.func,
  clearFollowingRewards: PropTypes.func,
  hasMoreFollowingRewards: PropTypes.bool,
  loading: PropTypes.bool,
  followingRewards: PropTypes.arrayOf(PropTypes.shape()),
};

RewardsList.defaultProps = {
  userName: '',
  followingRewards: [],
  hasMoreFollowingRewards: false,
  loading: false,
  getFollowingRewards: () => {},
  clearFollowingRewards: () => {},
};

export default connect(
  state => ({
    userName: getAuthenticatedUserName(state),
    followingRewards: getSponsorsRewards(state),
    hasMoreFollowingRewards: getHasMoreFollowingRewards(state),
    loading: getIsLoading(state),
  }),
  {
    getFollowingRewards: getFollowingSponsorsRewards,
    clearFollowingRewards: clearFollowingSponsorsRewards,
  },
)(injectIntl(RewardsList));
