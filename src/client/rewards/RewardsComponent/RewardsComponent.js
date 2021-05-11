import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';
import { DEFAULT_RADIUS } from '../../../common/constants/map';
import FilteredRewardsList from '../FilteredRewardsList';
import { pendingUpdateSuccess } from '../../store/userStore/userActions';
import { delay } from '../rewardsHelpers';
import { getSort } from '../rewardsHelper';
import { getAuthenticatedUserName } from '../../store/authStore/authSelectors';
import { getPendingUpdate } from '../../store/userStore/userSelectors';
import { getHelmetIcon } from '../../store/appStore/appSelectors';

const RewardsComponent = ({
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
  const desc = 'Reserve the reward for a few days. Share photos of the dish and get the reward!';
  const img =
    'https://images.hive.blog/p/7ohP4GDMGPrUMp8dW6yuJTR9MKNu8P8DCXDU9qmmkDVESrRynVRHNb6opaQtSHap1Kp23L83p583HN81Nb4uK53JScz5TNGRon3X?format=match&mode=fit';
  const waivioHost = global.postOrigin || 'https://www.waivio.com';
  const urlCurr = `${waivioHost}/rewards/all`;
  const title = `Rewards - Waivio`;
  const helmetIcon = useSelector(getHelmetIcon);

  const getTypeRewards = () => {
    if (match.params.filterKey === 'active') return 'active';
    if (match.params.filterKey === 'reserved') return 'reserved';

    return 'all';
  };
  const filterKey = getTypeRewards();

  const username = useSelector(getAuthenticatedUserName);
  const pendingUpdate = useSelector(getPendingUpdate);
  const areaRewards = [+userLocation.lat, +userLocation.lon];
  const handleSortChange = sortRewards => {
    setSortValue(sortRewards);
    getPropositions({ username, match, area, sort: sortRewards, activeFilters });
  };

  useEffect(() => {
    if (!userLocation.lat || !userLocation.lon || !url || loadingCampaigns) return;
    const sort = getSort(match, sortAll, sortEligible, sortReserved);

    getPropositions({ username, match, area: areaRewards, sort, activeFilters });
    if (pendingUpdate) {
      dispatch(pendingUpdateSuccess());
      delay(6000).then(() => {
        getPropositions({ username, match, area, sort, activeFilters });
      });
    }
  }, [activeFilters, url]);

  return (
    <div className="Rewards">
      <Helmet>
        <title>{title}</title>
        <meta property="og:title" content={title} />
        <link rel="canonical" href={urlCurr} />
        <meta property="description" content={desc} />
        <meta name="twitter:card" content={'summary_large_image'} />
        <meta name="twitter:site" content={'@waivio'} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={desc} />
        <meta name="twitter:image" content={img} />
        <meta property="og:title" content={title} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={urlCurr} />
        <meta property="og:image" content={img} />
        <meta property="og:image:width" content="600" />
        <meta property="og:image:height" content="600" />
        <meta property="og:description" content={desc} />
        <meta property="og:site_name" content="Waivio" />
        <link rel="image_src" href={img} />
        <link id="favicon" rel="icon" href={helmetIcon} type="image/x-icon" />
      </Helmet>
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
};

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
