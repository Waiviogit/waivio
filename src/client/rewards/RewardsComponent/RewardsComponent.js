import React, { useEffect, memo, useRef } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { get } from 'lodash';
import { getAuthenticatedUserName, getPendingUpdate } from '../../reducers';
import { DEFAULT_RADIUS } from '../../../common/constants/map';
import FilteredRewardsList from '../FilteredRewardsList';
import { pendingUpdateSuccess } from '../../user/userActions';
import { delay } from '../rewardsHelpers';
import { getSort } from '../rewardsHelper';

const RewardsComponent = memo(
  ({
    match,
    activeFilters,
    area,
    getPropositions,
    intl,
    campaignsLayoutWrapLayout,
    loading,
    hasMore,
    sponsors,
    loadingCampaigns,
    propositions,
    isSearchAreaFilter,
    resetMapFilter,
    handleLoadMore,
    setSortValue,
    userLocation,
    sortEligible,
    sortAll,
    sortReserved,
    campaignsTypes,
    setFilterValue,
    url,
  }) => {
    const dispatch = useDispatch();

    const getTypeRewards = () => {
      if (match.params.filterKey === 'active') return 'active';
      if (match.params.filterKey === 'reserved') return 'reserved';
      return 'all';
    };
    const filterKey = getTypeRewards();

    const username = useSelector(getAuthenticatedUserName);
    const pendingUpdate = useSelector(getPendingUpdate);
    const areaRewards = [+userLocation.lat, +userLocation.lon];
    const campaignParent = get(match, ['params', 'campaignParent']);
    const filterKeyParams = get(match, ['params', 'filterKey']);
    const prevFilterKeyParams = useRef(undefined);

    const handleSortChange = sortRewards => {
      setSortValue(sortRewards);
      getPropositions({ username, match, area, sort: sortRewards, activeFilters });
    };

    useEffect(() => {
      if (!userLocation.lat || !userLocation.lon || !url) return;
      const sort = getSort(match, sortAll, sortEligible, sortReserved);
      getPropositions({ username, match, area: areaRewards, sort, activeFilters });
      prevFilterKeyParams.current = filterKeyParams;
      if (pendingUpdate) {
        dispatch(pendingUpdateSuccess());
        delay(6000).then(() => {
          getPropositions({ username, match, area, sort, activeFilters });
        });
      }
    }, [campaignParent, filterKeyParams, prevFilterKeyParams, JSON.stringify(activeFilters)]);
    return (
      <div className="Rewards">
        <FilteredRewardsList
          {...{
            intl,
            campaignsLayoutWrapLayout,
            loadingCampaigns,
            loading,
            hasMore,
            handleSortChange,
            sortEligible,
            sortAll,
            sortReserved,
            sponsors,
            match,
            filterKey,
            propositions,
            isSearchAreaFilter,
            resetMapFilter,
            handleLoadMore,
            userName: username,
            campaignsTypes,
            setFilterValue,
            activeFilters,
            pendingUpdate,
          }}
        />
      </div>
    );
  },
);

RewardsComponent.propTypes = {
  match: PropTypes.shape().isRequired,
  activeFilters: PropTypes.shape().isRequired,
  area: PropTypes.arrayOf(PropTypes.number),
  radius: PropTypes.number,
  getPropositions: PropTypes.func.isRequired,
  getPropositionsByStatus: PropTypes.func.isRequired,
  intl: PropTypes.shape().isRequired,
  campaignsLayoutWrapLayout: PropTypes.func.isRequired,
  hasMore: PropTypes.bool,
  loading: PropTypes.bool,
  sponsors: PropTypes.arrayOf(PropTypes.string),
  propositions: PropTypes.arrayOf(PropTypes.shape()),
  loadingCampaigns: PropTypes.bool,
  isSearchAreaFilter: PropTypes.bool,
  resetMapFilter: PropTypes.func,
  handleLoadMore: PropTypes.func,
  setSortValue: PropTypes.func,
  userLocation: PropTypes.shape(),
  sortEligible: PropTypes.string,
  sortAll: PropTypes.string,
  sortReserved: PropTypes.string,
  campaignsTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
  setFilterValue: PropTypes.func,
  url: PropTypes.string,
};

RewardsComponent.defaultProps = {
  area: [],
  radius: DEFAULT_RADIUS,
  hasMore: false,
  loading: false,
  sponsors: [],
  propositions: [],
  loadingCampaigns: false,
  isSearchAreaFilter: false,
  resetMapFilter: () => {},
  handleLoadMore: () => {},
  setSortValue: () => {},
  setFilterValue: () => {},
  userLocation: {},
  sortEligible: 'proximity',
  sortAll: 'proximity',
  sortReserved: 'proximity',
  url: '',
};

export default RewardsComponent;
