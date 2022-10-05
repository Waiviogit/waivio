import React, { useEffect, useState } from 'react';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router';
import Campaing from '../reuseble/Campaing';
import Loading from '../../components/Icon/Loading';
import ReduxInfiniteScroll from '../../vendor/ReduxInfiniteScroll';
import EmptyCampaing from '../../statics/EmptyCampaing';
import RewardsFilters from '../Filters/Filters';
import FiltersForMobile from '../Filters/FiltersForMobile';

import './RewardLists.less';
import SortSelector from '../../components/SortSelector/SortSelector';

const filterConfig = [
  { title: 'Rewards for', type: 'type' },
  { title: 'Sponsors', type: 'sponsors' },
];

const sortConfig = [
  { key: 'default', title: 'Default' },
  { key: 'payout', title: 'Payouts' },
  { key: 'reward', title: 'Amount' },
  { key: 'date', title: 'Expiry' },
  { key: 'proximity', title: 'Proximity' },
];

const RenderCampaingList = ({ getAllRewardList, title, getFilters }) => {
  const [rewards, setRewards] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('default');
  const history = useHistory();
  const [visible, setVisible] = useState(false);
  const search = history.location.search.replace('?', '&');

  const onClose = () => setVisible(false);

  useEffect(() => {
    getAllRewardList(0, search, sort)
      .then(res => {
        setRewards(res.rewards);
        setHasMore(res.hasMore);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [history.location.search, sort]);

  const handleLoadingMoreRewardsList = () => {
    setLoading(true);

    getAllRewardList(rewards?.length, search, sort)
      .then(res => {
        setRewards([...rewards, ...res.rewards]);
        setHasMore(res.hasMore);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  if (loading && isEmpty(rewards)) return <Loading />;

  return (
    <div className="RewardLists">
      <div className="RewardLists__feed">
        <FiltersForMobile setVisible={setVisible} />
        <h2>{title}</h2>
        <SortSelector sort={sort} onChange={setSort}>
          {sortConfig.map(item => (
            <SortSelector.Item key={item.key}>{item.title}</SortSelector.Item>
          ))}
        </SortSelector>
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
