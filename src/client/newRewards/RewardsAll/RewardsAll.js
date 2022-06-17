import React, { useEffect, useState } from 'react';
import { isEmpty } from 'lodash';

import { getAllRewardList } from '../../../waivioApi/ApiClient';
import Campaing from '../reuseble/Campaing';
import Loading from '../../components/Icon/Loading';
import ReduxInfiniteScroll from '../../vendor/ReduxInfiniteScroll';

const RewardsAll = () => {
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
      <h2>All rewards</h2>
      {isEmpty(rewards) ? (
        <div>We havent any rewads</div>
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

export default RewardsAll;
