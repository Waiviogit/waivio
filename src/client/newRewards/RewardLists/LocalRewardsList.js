import React, { useEffect, useState } from 'react';
import { Checkbox } from 'antd';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { useHistory, useRouteMatch } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { setGoogleTagEvent } from '../../../common/helpers';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import Campaing from '../reuseble/Campaing';
import Loading from '../../components/Icon/Loading';
import ReduxInfiniteScroll from '../../vendor/ReduxInfiniteScroll';
import EmptyCampaign from '../../statics/EmptyCampaign';
import RewardsFilters from '../Filters/Filters';
import FiltersForMobile from '../Filters/FiltersForMobile';
import SortSelector from '../../components/SortSelector/SortSelector';
import RewardsMap from '../Map';
import ViewMapButton from '../../widgets/ViewMapButton';
import {
  getFiltersForAllRewards,
  getFiltersForEligibleRewards,
  getMarkersForAll,
  getMarkersForEligible,
} from '../../../waivioApi/ApiClient';
import useQuery from '../../../hooks/useQuery';
import { getCoordinates } from '../../../store/userStore/userActions';
import { getRadius } from '../../components/Maps/mapHelpers';

import './RewardLists.less';
import { getMoreRewardsList, getRewardsList } from '../../../store/newRewards/newRewardsActions';
import {
  getRewards,
  getRewardsHasLoading,
  getRewardsHasMore,
} from '../../../store/newRewards/newRewardsSelectors';

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

const LocalRewardsList = ({ withoutFilters, intl }) => {
  const authUser = useSelector(getAuthenticatedUserName);
  const rewards = useSelector(getRewards);
  const hasMore = useSelector(getRewardsHasMore);
  const loading = useSelector(getRewardsHasLoading);

  const [showMap, setShowMap] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [location, setLocation] = useState([]);
  const [sort, setSort] = useState('default');
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();
  const query = useQuery();
  const history = useHistory();
  const match = useRouteMatch();
  const isLocation = match.params[0] === 'local';
  const onClose = () => setVisible(false);
  const clearMapInfo = () => {
    query.delete('area');
    query.delete('zoom');
    query.delete('radius');
  };

  const getRewardsMethod = async skip => {
    query.delete('showAll');
    if (isLocation && !history.location.search.includes('area')) {
      let coordinats = location;

      if (isEmpty(coordinats)) {
        const { value } = await dispatch(getCoordinates());

        coordinats = value;
        setLocation(value);
      }

      query.set('area', [coordinats.latitude, coordinats.longitude]);
      query.set('zoom', 3);
      query.set('radius', getRadius(3));
    } else if (!history.location.search) clearMapInfo();

    return skip
      ? dispatch(getMoreRewardsList(showAll, skip, query.toString(), sort, match.params[0]))
      : dispatch(getRewardsList(showAll, query.toString(), sort, match.params[0]));
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
    setGoogleTagEvent('view_earn');

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
    getRewardsMethod(0);
    clearMapInfo();
  }, [history.location.search, sort, match.params[0], showAll]);

  const handleLoadingMoreRewardsList = () => {
    getRewardsMethod(rewards?.length);
  };

  if (loading && isEmpty(rewards)) return <Loading />;

  return (
    <div className="RewardLists">
      <div className="RewardLists__feed">
        <FiltersForMobile setVisible={setVisible} />
        <h2 className="RewardLists__title">
          {isLocation
            ? intl.formatMessage({ id: 'local', defaultMessage: 'Local' })
            : intl.formatMessage({ id: 'global', defaultMessage: 'Global' })}{' '}
          {intl.formatMessage({ id: 'rewards', defaultMessage: 'rewards' })}
        </h2>
        <ViewMapButton handleClick={() => setShowMap(true)} />
        <SortSelector sort={sort} onChange={setSort}>
          {sortConfig.map(item => (
            <SortSelector.Item key={item.key}>{item.title}</SortSelector.Item>
          ))}
        </SortSelector>
        {isEmpty(rewards) ? (
          <EmptyCampaign
            emptyMessage={intl.formatMessage({
              id: 'empty_campaign_message',
              defaultMessage: 'There are no rewards available for you to claim at this moment.',
            })}
          />
        ) : (
          <ReduxInfiniteScroll
            loadMore={handleLoadingMoreRewardsList}
            // loader={<Loading />}
            loadingMore={loading}
            hasMore={hasMore}
            elementIsScrollable={false}
            threshold={500}
          >
            {rewards?.map(cap => (
              <Campaing
                key={cap?._id}
                campain={{ ...cap, rewardInUSD: cap?.rewardInUSD || cap?.payout }}
              />
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
              <span className="RewardsFilters__subtitle">
                {intl.formatMessage({
                  id: 'eligibility',
                  defaultMessage: 'Eligibility',
                })}
                :
              </span>
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
  withoutFilters: PropTypes.bool,
  intl: PropTypes.shape(),
};

LocalRewardsList.fetchData = ({ store, match }) =>
  store.dispatch(getRewardsList(true, 0, '', 'default', match.params[0]));

export default injectIntl(LocalRewardsList);
