import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Icon } from 'antd';
import { isEmpty, memoize } from 'lodash';
import { isNeedFilters } from '../helper';
import {
  getAvailableFilters,
  getFilteredObjectsMap,
  getActiveFilters,
  getUserLocation,
  getHasMap,
  getIsMapModalOpen,
} from '../../reducers';
import { setFiltersAndLoad, getObjectTypeMap } from '../../objectTypes/objectTypeActions';
import { setMapFullscreenMode } from '../../components/Maps/mapActions';
import { getCoordinates } from '../../user/userActions';
import MapWrap from '../../components/Maps/MapWrap/MapWrap';
import FiltersContainer from './FiltersContainer';
import '../../components/Sidebar/SidebarContentBlock.less';

const DiscoverFiltersSidebar = ({ intl, match, history }) => {
  // redux-store
  const dispatch = useDispatch();
  const wobjects = useSelector(getFilteredObjectsMap);
  const userLocation = useSelector(getUserLocation);
  const filters = useSelector(getAvailableFilters);
  const activeFilters = useSelector(getActiveFilters);
  const hasMap = useSelector(getHasMap);
  const isFullscreenMode = useSelector(getIsMapModalOpen);

  if (isEmpty(userLocation)) {
    dispatch(getCoordinates());
  }

  const objectType = match.params.typeName;

  const setSearchArea = map => dispatch(setFiltersAndLoad({ ...activeFilters, map }));
  const setMapArea = map => dispatch(getObjectTypeMap(map, isFullscreenMode));

  const handleMapSearchClick = map => {
    setSearchArea(map);
    dispatch(setMapFullscreenMode(false));
  };

  const handleMapMarkerClick = permlink => history.push(`/object/${permlink.payload.id}`);

  const wobjectsWithMap = wobjects.filter(wobj => !isEmpty(wobj.map));

  const isTypeHasFilters = memoize(isNeedFilters);
  return isTypeHasFilters(objectType) ? (
    <div className="discover-objects-filters">
      {hasMap ? (
        <MapWrap
          wobjects={wobjectsWithMap}
          onMarkerClick={handleMapMarkerClick}
          getAreaSearchData={setSearchArea}
          setMapArea={setMapArea}
          userLocation={userLocation}
          customControl={<Icon type="search" style={{ fontSize: '25px', color: '#000000' }} />}
          onCustomControlClick={handleMapSearchClick}
        />
      ) : null}
      {!isEmpty(filters) ? (
        <div className="SidebarContentBlock">
          <div className="SidebarContentBlock__title">
            <i className="iconfont icon-trysearchlist SidebarContentBlock__icon" />
            {intl.formatMessage({ id: 'filters', defaultMessage: 'Filter' })}
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

export default injectIntl(withRouter(DiscoverFiltersSidebar));
