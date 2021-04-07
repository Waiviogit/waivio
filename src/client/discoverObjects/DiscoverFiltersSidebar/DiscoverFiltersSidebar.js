import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Icon } from 'antd';
import { isEmpty, memoize } from 'lodash';
import { isNeedFilters } from '../helper';
import { getUserLocation, getIsMapModalOpen } from '../../store/reducers';
import { setFiltersAndLoad, getObjectTypeMap } from '../../store/objectTypeStore/objectTypeActions';
import { setMapFullscreenMode } from '../../components/Maps/mapActions';
import { getCoordinates } from '../../user/userActions';
import MapWrap from '../../components/Maps/MapWrap/MapWrap';
import FiltersContainer from './FiltersContainer';
import '../../components/Sidebar/SidebarContentBlock.less';
import { DEFAULT_RADIUS, DEFAULT_ZOOM } from '../../../common/constants/map';
import { getWobjectsForMap } from '../../object/wObjectHelper';
import {
  getActiveFilters,
  getAvailableFilters,
  getFilteredObjects,
  getFilteredObjectsMap,
  getFiltersTags,
  getHasMap,
} from '../../store/objectTypeStore/objectTypeSelectors';

const DiscoverFiltersSidebar = ({ intl, match, history }) => {
  // redux-store
  const dispatch = useDispatch();
  const wobjects = useSelector(getFilteredObjectsMap);
  const userLocation = useSelector(getUserLocation);
  const filters = useSelector(getAvailableFilters);
  const filteredObjects = useSelector(getFilteredObjects);
  const activeFilters = useSelector(getActiveFilters);
  const hasMap = useSelector(getHasMap);
  const isFullscreenMode = useSelector(getIsMapModalOpen);
  const tagsFilters = useSelector(getFiltersTags);

  if (isEmpty(userLocation)) dispatch(getCoordinates());

  const objectType = match.params.typeName;
  const setSearchArea = map => dispatch(setFiltersAndLoad({ ...activeFilters, map }));
  const setMapArea = ({ radius, coordinates }) => {
    if (isEmpty(activeFilters))
      dispatch(getObjectTypeMap({ radius, coordinates }, isFullscreenMode));
  };

  useEffect(() => {
    setMapArea({
      radius: DEFAULT_RADIUS,
      coordinates: [+userLocation.lat, +userLocation.lon],
      isMap: true,
      firstMapLoad: true,
    });
  }, [history.location.search]);

  const handleMapSearchClick = map => {
    setSearchArea(map);
    dispatch(setMapFullscreenMode(false));
  };

  const handleMapMarkerClick = permlink => history.push(`/object/${permlink}`);
  const wobjectsForMap = useMemo(() => getWobjectsForMap(wobjects), [wobjects]);
  const isTypeHasFilters = memoize(isNeedFilters);
  const currentObjList = !isEmpty(activeFilters) ? filteredObjects : wobjectsForMap;

  return (
    isTypeHasFilters(objectType) && (
      <div className="discover-objects-filters">
        {hasMap && (
          <MapWrap
            wobjects={currentObjList}
            onMarkerClick={handleMapMarkerClick}
            getAreaSearchData={setSearchArea}
            setMapArea={setMapArea}
            userLocation={userLocation}
            customControl={<Icon type="search" style={{ fontSize: '25px', color: '#000000' }} />}
            onCustomControlClick={handleMapSearchClick}
            match={match}
            zoomMap={DEFAULT_ZOOM}
          />
        )}
        {(!isEmpty(filters) || !isEmpty(tagsFilters)) && (
          <div className="SidebarContentBlock">
            <div className="SidebarContentBlock__title">
              <i className="iconfont icon-trysearchlist SidebarContentBlock__icon" />
              {intl.formatMessage({ id: 'filters', defaultMessage: 'Filter' })}
            </div>
            <FiltersContainer filters={filters} tagsFilters={tagsFilters} />
          </div>
        )}
      </div>
    )
  );
};

DiscoverFiltersSidebar.propTypes = {
  intl: PropTypes.shape().isRequired,
  history: PropTypes.shape().isRequired,
  match: PropTypes.shape().isRequired,
};

export default injectIntl(withRouter(DiscoverFiltersSidebar));
