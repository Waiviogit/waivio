import React, { useEffect, useState, useRef, memo } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { isEmpty, isEqual } from 'lodash';
import { getAuthenticatedUserName, getUserLocation } from '../../reducers';
import { DEFAULT_RADIUS } from '../../../common/constants/map';
import FilteredRewardsList from '../FilteredRewardsList';

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
  }) => {
    const [sort, setSort] = useState('proximity');
    const { campaignParent } = useParams();

    // const isAll = location.pathname === '/rewards/all';
    // const isEligible = location.pathname === '/rewards/active';
    // const isReserved = location.pathname === '/rewards/reserved';
    const username = useSelector(getAuthenticatedUserName);
    const userLocation = useSelector(getUserLocation);
    const areaRewards = [+userLocation.lat, +userLocation.lon];
    const prevLocation = useRef(userLocation);
    const prevCampaignParent = useRef();

    const handleSortChange = sortRewards => {
      setSort(sortRewards);
      getPropositions({ username, match, area, sort: sortRewards, activeFilters });
    };

    useEffect(() => {
      if (campaignParent) return;
      if (!isEmpty(userLocation) && isEmpty(activeFilters)) {
        getPropositions({ username, match, area: areaRewards, sort, activeFilters });
      }
    }, []);

    useEffect(() => {
      if (campaignParent) return;
      if (!isEmpty(userLocation) && !isEqual(userLocation, prevLocation.current)) {
        getPropositions({ username, match, area: areaRewards, sort, activeFilters });
        prevLocation.current = userLocation;
      }
    }, [userLocation]);

    useEffect(() => {
      if (prevCampaignParent.current !== campaignParent) {
        getPropositions({ username, match, area: areaRewards, sort, activeFilters });
        prevCampaignParent.current = campaignParent;
      }
    }, [campaignParent]);

    useEffect(() => {
      if (campaignParent) return;
      getPropositions({ username, match, area: areaRewards, sort, activeFilters });
    }, [JSON.stringify(activeFilters)]);

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
            filterKey: 'all',
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
};

RewardsComponent.defaultProps = {
  area: [],
  radius: DEFAULT_RADIUS,
  hasMore: false,
  loading: false,
  sponsors: [],
  propositions: [],
  loadingCampaigns: false,
};

export default RewardsComponent;
