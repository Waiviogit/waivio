import React, { useEffect, useState } from 'react';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';

import Campaing from './reuseble/Campaing';
import Loading from '../components/Icon/Loading';
import ReduxInfiniteScroll from '../vendor/ReduxInfiniteScroll';
import EmptyCampaing from '../statics/EmptyCampaing';

const RenderCampaingList = ({ getAllRewardList }) => {
  const [rewards, setRewards] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllRewardList()
      .then(res => {
        setRewards(res.rewards);
        setHasMore(res.hasMore);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleLoadingMoreRewardsList = () => {
    setLoading(true);

    getAllRewardList(rewards?.length)
      .then(res => {
        setRewards([...rewards, ...res.rewards]);
        setHasMore(res.hasMore);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  if (loading && isEmpty(rewards)) return <Loading />;

  return (
    <div>
      {isEmpty(rewards) ? (
        <EmptyCampaing />
      ) : (
        <ReduxInfiniteScroll
          loadMore={handleLoadingMoreRewardsList}
          loader={<Loading />}
          loadingMore={loading}
          hasMore={hasMore}
          elementIsScrollable={false}
          threshold={500}
        >
          {rewards?.map(cap => (
            <Campaing key={cap?._id} campain={cap} />
          ))}
        </ReduxInfiniteScroll>
      )}
    </div>
  );
};

RenderCampaingList.propTypes = {
  getAllRewardList: PropTypes.func.isRequired,
};

export default RenderCampaingList;
