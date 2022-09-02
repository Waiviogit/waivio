import React, { useEffect, useState } from 'react';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router';
import { Tag } from 'antd';
import Campaing from '../reuseble/Campaing';
import Loading from '../../components/Icon/Loading';
import ReduxInfiniteScroll from '../../vendor/ReduxInfiniteScroll';
import EmptyCampaing from '../../statics/EmptyCampaing';
import RewardsFilters from '../Filters/Filters';
import { parseQuery } from '../../../waivioApi/helpers';

import './RewardLists.less';

const filterConfig = [
  { title: 'Rewards for', type: 'type' },
  { title: 'Sponsors', type: 'sponsors' },
];

const RenderCampaingList = ({ getAllRewardList, title, getFilters }) => {
  const [rewards, setRewards] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const search = query.toString() ? `&${query.toString()}` : '';
  const [visible, setVisible] = useState(false);
  const onClose = () => setVisible(false);

  useEffect(() => {
    getAllRewardList(0, search)
      .then(res => {
        setRewards(res.rewards);
        setHasMore(res.hasMore);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [search]);

  const handleLoadingMoreRewardsList = () => {
    setLoading(true);

    getAllRewardList(rewards?.length, search)
      .then(res => {
        setRewards([...rewards, ...res.rewards]);
        setHasMore(res.hasMore);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  if (loading && isEmpty(rewards)) return <Loading />;
  const filterList = Object.values(parseQuery(search)).reduce((acc, curr) => [...acc, ...curr], []);

  return (
    <div className="RewardLists">
      <div className="RewardLists__feed">
        <p className={'RewardLists__filterButton'}>
          Filters:{' '}
          {filterList.map(f => (
            <Tag key={f} closable onClose={() => {}}>
              {f}
            </Tag>
          ))}{' '}
          <span
            className={'RewardLists__filterButton--withUnderline'}
            onClick={() => setVisible(true)}
          >
            add
          </span>
        </p>
        <h2>{title}</h2>
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
      <div className={'RewardLists__left'}>
        <RewardsFilters
          title={'Filter rewards'}
          getFilters={getFilters}
          config={filterConfig}
          visible={visible}
          onClose={onClose}
        />
      </div>
    </div>
  );
};

RenderCampaingList.propTypes = {
  getAllRewardList: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  getFilters: PropTypes.func.isRequired,
};

export default RenderCampaingList;
