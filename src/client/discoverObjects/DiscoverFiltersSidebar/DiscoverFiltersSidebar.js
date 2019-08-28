import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { isEmpty, memoize, omit } from 'lodash';
import { isNeedFilters } from '../helper';
import {
  getAvailableFilters,
  getFilteredObjects,
  getActiveFilters,
  getUserLocation,
  getHasMap,
} from '../../reducers';
import { setFiltersAndLoad } from '../../objectTypes/objectTypeActions';
import { getCoordinates } from '../../user/userActions';
import MapWrap from '../../components/Maps/MapWrap/MapWrap';
import FiltersContainer from './FiltersContainer';
import '../../components/Sidebar/SidebarContentBlock.less';

const DiscoverFiltersSidebar = ({ intl, match, history }) => {
  // redux-store
  const dispatch = useDispatch();
  const wobjects = useSelector(getFilteredObjects);
  const userLocation = useSelector(getUserLocation);
  const filters = useSelector(getAvailableFilters);
  const activeFilters = useSelector(getActiveFilters);
  const hasMap = useSelector(getHasMap);

  if (isEmpty(userLocation)) {
    dispatch(getCoordinates());
  }

  const setSearchArea = map => {
    const updatedFilters =
      map.radius === 0 && isEmpty(map.coordinates)
        ? omit(activeFilters, ['map'])
        : { ...activeFilters, map };
    dispatch(setFiltersAndLoad(updatedFilters));
  };

  const handleMapMarkerClick = permlink => history.push(`/object/${permlink}`);

  const wobjectsWithMap = wobjects.filter(wobj => !isEmpty(wobj.map));

  const isTypeHasFilters = memoize(isNeedFilters);
  return isTypeHasFilters(match.params.objectType) ? (
    <div className="discover-objects-filters">
      {hasMap ? (
        <MapWrap
          wobjects={wobjectsWithMap}
          onMarkerClick={handleMapMarkerClick}
          getAreaSearchData={setSearchArea}
          userLocation={userLocation}
        />
      ) : null}
      {!isEmpty(filters) ? (
        <div className="SidebarContentBlock">
          <div className="SidebarContentBlock__title">
            <i className="iconfont icon-trysearchlist SidebarContentBlock__icon" />
            <FormattedMessage id="filters" defaultMessage="Filter" />
          </div>
          <FiltersContainer intl={intl} filters={filters} />
        </div>
      ) : null}
    </div>
  ) : null;
};

DiscoverFiltersSidebar.propTypes = {
  intl: PropTypes.shape().isRequired,
  history: PropTypes.shape().isRequired,
  match: PropTypes.shape().isRequired,
};

export default injectIntl(DiscoverFiltersSidebar);
