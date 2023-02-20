import React, { useEffect, useState } from 'react';
import { Checkbox } from 'antd';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { useHistory, useRouteMatch } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import Campaing from '../reuseble/Campaing';
import Loading from '../../components/Icon/Loading';
import ReduxInfiniteScroll from '../../vendor/ReduxInfiniteScroll';
import EmptyCampaing from '../../statics/EmptyCampaing';
import RewardsFilters from '../Filters/Filters';
import FiltersForMobile from '../Filters/FiltersForMobile';
import SortSelector from '../../components/SortSelector/SortSelector';
import RewardsMap from '../Map';
import ViewMapButton from '../../widgets/ViewMapButton';
import {
  getAllRewardList,
  getEligibleRewardList,
  getFiltersForAllRewards,
  getFiltersForEligibleRewards,
  getMarkersForAll,
  getMarkersForEligible,
} from '../../../waivioApi/ApiClient';

import './RewardLists.less';
import useQuery from '../../../hooks/useQuery';
import { getCoordinates } from '../../../store/userStore/userActions';
import { getRadius } from '../../components/Maps/mapHelper';

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

const LocalRewardsList = ({ title, withoutFilters }) => {
  const authUser = useSelector(getAuthenticatedUserName);
  const [rewards, setRewards] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [showMap, setShowMap] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [sort, setSort] = useState('default');
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();
  const query = useQuery();
  const history = useHistory();
  const match = useRouteMatch();
  const isLocation = match.params[0] === 'local';
  const onClose = () => setVisible(false);

  const getRewardsMethod = async skip => {
    query.delete('showAll');

    if (isLocation && !query.get('area')) {
      const { value } = await dispatch(getCoordinates());

      query.set('area', [value.latitude, value.longitude]);
      query.set('zoom', 3);
      query.set('radius', getRadius(3));
    } else {
      query.delete('area');
      query.delete('zoom');
      query.delete('radius');
    }

    return showAll
      ? getAllRewardList(skip, query.toString(), sort, match.params[0])
      : getEligibleRewardList(authUser, skip, query.toString(), sort, match.params[0]);
  };
  const getFilters = () =>
    showAll
      ? getFiltersForAllRewards(match.params[0])
      : getFiltersForEligibleRewards(authUser, match.params[0]);
  const getMarkers = (userName, boundsParams) =>
    showAll
      ? getMarkersForAll(userName, boundsParams, 0, 20, match.params[0])
      : getMarkersForEligible(userName, boundsParams, 0, 20, match.params[0]);

  const handleCheckshowAll = () => {
    setShowAll(!showAll);

    if (showAll) {
      query.delete('showAll');
    } else {
      query.set('showAll', 'true');
    }

    history.push(`?${query.toString()}`);
  };

  useEffect(() => {
    if (query.get('showAll') || !authUser) {
      setShowAll(true);
      query.set('showAll', true);
      history.push(`?${query.toString()}`);
    }
  }, []);

  useEffect(() => {
    if (authUser) setShowAll(false);
  }, [history.location.pathname]);

  useEffect(() => {
    getRewardsMethod(0)
      .then(res => {
        setRewards(res.rewards);
        setHasMore(res.hasMore);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [history.location.search, sort, match.params[0], showAll]);

  const handleLoadingMoreRewardsList = () => {
    setLoading(true);

    getRewardsMethod(rewards?.length)
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
        <h2 className="RewardLists__title">{title}</h2>
        <ViewMapButton handleClick={() => setShowMap(true)} />
        <SortSelector sort={sort} onChange={setSort}>
          {sortConfig.map(item => (
            <SortSelector.Item key={item.key}>{item.title}</SortSelector.Item>
          ))}
        </SortSelector>
        {isEmpty(rewards) ? (
          <EmptyCampaing
            emptyMessage={'There are no rewards available for you to claim at this moment.'}
          />
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
      {!withoutFilters && (
        <div className={'RewardLists__left'}>
          {isLocation && (
            <RewardsMap
              getPoints={getMarkers}
              visible={showMap}
              onClose={() => setShowMap(false)}
            />
          )}
          <RewardsFilters
            title={'Filter rewards'}
            getFilters={getFilters}
            config={filterConfig}
            visible={visible}
            onClose={onClose}
          >
            <div className="RewardsFilters__block">
              <span className="RewardsFilters__subtitle">Eligibility:</span>
              <div>
                <Checkbox disabled={!authUser} checked={showAll} onChange={handleCheckshowAll}>
                  {' '}
                  show all rewards
                </Checkbox>
              </div>
            </div>
          </RewardsFilters>
        </div>
      )}
    </div>
  );
};

LocalRewardsList.propTypes = {
  title: PropTypes.string.isRequired,
  withoutFilters: PropTypes.bool,
};

export default LocalRewardsList;
