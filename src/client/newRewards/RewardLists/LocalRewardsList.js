import React, { useEffect, useState } from 'react';
import { Checkbox } from 'antd';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { useHistory, useRouteMatch } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { setGoogleTagEvent } from '../../../common/helpers';
import { isMobile } from '../../../common/helpers/apiHelpers';
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
  getJudgeRewardsFiltersBySponsor,
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
const judgeFilterConfig = [{ title: 'Sponsors', type: 'sponsors' }];

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
  const [sort, setSort] = useState(isJudges ? 'sponsors' : 'default');
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();
  const query = useQuery();
  const history = useHistory();
  const match = useRouteMatch();
  const isLocation = match.params[0] === 'local';
  const isJudges = match.params[0] === 'judges';

  const currentSortConfig = isJudges ? [{ key: 'sponsors', title: 'Sponsors' }] : sortConfig;
  let title;

  if (isJudges) {
    title = intl.formatMessage({ id: 'judges', defaultMessage: 'Judges' });
  } else if (isLocation) {
    title = intl.formatMessage({ id: 'local_rewards', defaultMessage: 'Local rewards' });
  } else {
    title = intl.formatMessage({ id: 'global_rewards', defaultMessage: 'Global rewards' });
  }
  const onClose = () => setVisible(false);
  const clearMapInfo = () => {
    query.delete('area');
    query.delete('zoom');
    query.delete('radius');
  };

  // eslint-disable-next-line consistent-return
  const getRewardsMethod = async skip => {
    try {
      query.delete('showAll');
      if (isLocation && !history.location.search?.includes('area')) {
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
    } catch (e) {
      console.error(e);
    }
  };

  const getFilters = () => {
    if (isJudges) {
      return getJudgeRewardsFiltersBySponsor(authUser);
    }

    return showAll
      ? getFiltersForAllRewards(match.params[0])
      : getFiltersForEligibleRewards(authUser, match.params[0]);
  };

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
    getRewardsMethod(0).catch(err => {
      console.error('Error loading rewards:', err);
    });
    clearMapInfo();
  }, [history.location.search, sort, match.params[0], showAll]);

  const handleLoadingMoreRewardsList = () => {
    getRewardsMethod(rewards?.length).catch(err => {
      console.error('Error loading more rewards:', err);
    });
  };

  if (loading && isEmpty(rewards)) return <Loading />;

  return (
    <div className="RewardLists">
      <div className="RewardLists__feed">
        <FiltersForMobile setVisible={setVisible} />
        <h2 className="RewardLists__title">{title}</h2>
        {isMobile() && isJudges && (
          <div className={'PropositionList__breadcrumbs'}>
            <div className={'PropositionList__page'}>{title}</div>
          </div>
        )}
        {isJudges && (
          <div>
            {!isMobile() && <br />}
            You have been selected as a judge for these campaigns.
          </div>
        )}
        {!isJudges && <ViewMapButton handleClick={() => setShowMap(true)} />}
        {!isJudges && (
          <SortSelector sort={sort} onChange={setSort}>
            {currentSortConfig.map(item => (
              <SortSelector.Item key={item.key}>{item.title}</SortSelector.Item>
            ))}
          </SortSelector>
        )}
        {isEmpty(rewards) ? (
          <EmptyCampaign
            emptyMessage={
              isJudges
                ? 'There are no campaigns you have been added to as а judge.'
                : intl.formatMessage({
                    id: 'empty_campaign_message',
                    defaultMessage:
                      'There are no rewards available for you to claim at this moment.',
                  })
            }
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
              <Campaing
                key={cap?.guideName + cap?.lastCreated}
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
            config={isJudges ? judgeFilterConfig : filterConfig}
            visible={visible}
            onClose={onClose}
          >
            {!isJudges && (
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
            )}
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
