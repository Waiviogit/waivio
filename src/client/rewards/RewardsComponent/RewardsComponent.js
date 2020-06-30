import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { isEmpty, isEqual } from 'lodash';
import { getAuthenticatedUserName, getUserLocation } from '../../reducers';
import { DEFAULT_RADIUS } from '../../../common/constants/map';
import FilteredRewardsList from '../FilteredRewardsList';

const RewardsComponent = ({
  match,
  activeFilters,
  area,
  radius,
  getPropositions,
  intl,
  campaignsLayoutWrapLayout,
  loading,
  hasMore,
  sponsors,
}) => {
  const [loadingCampaigns, setLoadingCampaigns] = useState(false);
  const [sort, setSort] = useState('proximity');

  // const location = useLocation();
  const { campaignParent } = useParams();

  // const isAll = location.pathname === '/rewards/all';
  // const isEligible = location.pathname === '/rewards/active';
  // const isReserved = location.pathname === '/rewards/reserved';
  const username = useSelector(getAuthenticatedUserName);
  const userLocation = useSelector(getUserLocation);
  const areaRewards = [+userLocation.lat, +userLocation.lon];
  const prevLocation = useRef(userLocation);

  const handleSortChange = sortRewards => {
    setLoadingCampaigns(true);
    setSort(sortRewards);
    getPropositions({ username, match, area, radius, sort, activeFilters });
  };

  useEffect(() => {
    if (!isEmpty(userLocation) && !isEqual(userLocation, prevLocation.current)) {
      getPropositions({ username, match, area: areaRewards, sort, activeFilters });
      prevLocation.current = userLocation;
    }
  }, [userLocation]);

  useEffect(() => {
    getPropositions({ username, match, area: areaRewards, sort, activeFilters });
    // prevCampaignParent.current = campaignParent;
  }, [campaignParent]);

  console.log('prevLocation.current', prevLocation.current);
  console.log('userLocation', userLocation);

  // useEffect(() => {
  //   getPropositions({ username, match, area, sort, activeFilters });
  // }, [JSON.stringify(activeFilters)]);

  return (
    <div className="Rewards">
      111
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
};

RewardsComponent.propTypes = {
  match: PropTypes.shape().isRequired,
  activeFilters: PropTypes.shape().isRequired,
  area: PropTypes.arrayOf(PropTypes.number),
  radius: PropTypes.number,
  getPropositions: PropTypes.func.isRequired,
  intl: PropTypes.shape().isRequired,
  campaignsLayoutWrapLayout: PropTypes.func.isRequired,
  hasMore: PropTypes.string,
  loading: PropTypes.string,
  sponsors: PropTypes.arrayOf(PropTypes.shape()),
  propositions: PropTypes.arrayOf(PropTypes.shape()),
};

RewardsComponent.defaultProps = {
  area: [],
  radius: DEFAULT_RADIUS,
  hasMore: false,
  loading: false,
  sponsors: [],
  propositions: [],
};

export default RewardsComponent;
