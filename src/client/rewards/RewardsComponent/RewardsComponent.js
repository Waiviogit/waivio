import React, { useEffect, useRef, memo } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { isEqual, isEmpty, get } from 'lodash';
import { getAuthenticatedUserName, getPendingUpdate } from '../../reducers';
import { DEFAULT_RADIUS } from '../../../common/constants/map';
import FilteredRewardsList from '../FilteredRewardsList';
import { pendingUpdateSuccess } from '../../user/userActions';
import { delay } from '../rewardsHelpers';

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
    sort,
    userLocation,
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
    const prevLocation = useRef(userLocation);
    const prevCampaignParent = useRef();
    const prevMatch = useRef(match);
    const history = useHistory();

    const handleSortChange = sortRewards => {
      setSortValue(sortRewards);
      getPropositions({ username, match, area, sort: sortRewards, activeFilters });
    };

    useEffect(() => {
      if (campaignParent || isEmpty(userLocation)) return;
      if (!isEqual(userLocation, prevLocation.current)) {
        getPropositions({ username, match, area: areaRewards, sort, activeFilters });
        prevLocation.current = userLocation;
        return;
      }
      getPropositions({ username, match, area: areaRewards, sort, activeFilters });
    }, [userLocation, JSON.stringify(activeFilters)]);

    useEffect(() => {
      if (!isEqual(prevMatch.current, match)) {
        getPropositions({ username, match, area: areaRewards, sort, activeFilters });
        prevMatch.current = match;
      } else if (prevCampaignParent.current !== campaignParent) {
        getPropositions({ username, match, area: areaRewards, sort, activeFilters });
        prevCampaignParent.current = campaignParent;
      }
      if (pendingUpdate) {
        dispatch(pendingUpdateSuccess());
        delay(6000).then(() => {
          getPropositions({ username, match, area, sort, activeFilters });
        });
      }
    }, [campaignParent, match]);

    useEffect(() => {
      if (campaignParent) return;
      if (!username && match.params.filterKey !== 'all') {
        history.push(`/rewards/all`);
      }
    }, [username]);

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
            sort,
            sponsors,
            match,
            filterKey,
            propositions,
            isSearchAreaFilter,
            resetMapFilter,
            handleLoadMore,
            userName: username,
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
  intl: PropTypes.shape().isRequired,
  campaignsLayoutWrapLayout: PropTypes.func.isRequired,
  hasMore: PropTypes.bool,
  loading: PropTypes.bool,
  sponsors: PropTypes.arrayOf(PropTypes.shape()),
  propositions: PropTypes.arrayOf(PropTypes.shape()),
  loadingCampaigns: PropTypes.bool,
  isSearchAreaFilter: PropTypes.bool,
  resetMapFilter: PropTypes.func,
  handleLoadMore: PropTypes.func,
  setSortValue: PropTypes.func,
  sort: PropTypes.string,
  userLocation: PropTypes.shape(),
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
  sort: 'proximity',
  userLocation: {},
};

export default RewardsComponent;
