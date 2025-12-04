import React, { useEffect, useMemo, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Icon } from 'antd';
import { isEmpty, memoize, get, isArray } from 'lodash';
import { listOfMapObjectTypes } from '../../../common/constants/listOfObjectTypes';
import { isNeedFilters } from '../helper';
import {
  setFiltersAndLoad,
  getObjectTypeMap,
  setObjectSortType,
} from '../../../store/objectTypeStore/objectTypeActions';
import { setMapFullscreenMode } from '../../../store/mapStore/mapActions';
import { getCoordinates } from '../../../store/userStore/userActions';
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
} from '../../../store/objectTypeStore/objectTypeSelectors';
import { getUserLocation } from '../../../store/userStore/userSelectors';
import { getIsMapModalOpen } from '../../../store/mapStore/mapSelectors';
import { SORT_OPTIONS } from '../DiscoverObjectsContent';

const normalizeCoordinates = coords => {
  if (!coords) return null;
  if (isArray(coords)) return coords;

  if (coords.lat !== undefined && coords.lon !== undefined) {
    return [Number(coords.lat), Number(coords.lon)];
  }

  if (coords.latitude !== undefined && coords.longitude !== undefined) {
    return [Number(coords.latitude), Number(coords.longitude)];
  }

  return coords;
};

const DiscoverFiltersSidebar = ({ intl, match, history }) => {
  // redux-store
  const dispatch = useDispatch();
  const wobjects = useSelector(getFilteredObjectsMap);
  const userLocation = useSelector(getUserLocation);
  const filters = useSelector(getAvailableFilters);
  const filteredObjects = useSelector(getFilteredObjects);
  const activeFilters = useSelector(getActiveFilters);
  // const hasMap = useSelector(getHasMap);
  const hasMap = listOfMapObjectTypes.includes(match.params.typeName);
  const isFullscreenMode = useSelector(getIsMapModalOpen);
  const tagsFilters = useSelector(getFiltersTags);
  const [mapSettings, setMapSettings] = React.useState({
    zoom: DEFAULT_ZOOM,
    radius: DEFAULT_RADIUS,
    coordinates: normalizeCoordinates(userLocation),
  });
  const prevSearchRef = useRef(null);

  if (isEmpty(userLocation)) dispatch(getCoordinates());

  useEffect(() => {
    if (isEmpty(mapSettings.coordinates) || !mapSettings.coordinates) {
      setMapSettings(prev => ({ ...prev, coordinates: normalizeCoordinates(userLocation) }));
    }
  }, [userLocation]);

  useEffect(() => {
    const zoom = get(activeFilters, 'map.zoom', null);
    const radius = get(activeFilters, 'map.radius', null);
    const coordinates = get(activeFilters, 'map.coordinates', null);

    if (coordinates) {
      setMapSettings({
        zoom: zoom || DEFAULT_ZOOM,
        radius: radius || DEFAULT_RADIUS,
        coordinates: normalizeCoordinates(coordinates) || normalizeCoordinates(userLocation),
      });
      dispatch(setObjectSortType(SORT_OPTIONS.PROXIMITY));
    }
  }, [get(activeFilters, 'map.coordinates', null)]);

  const objectType = match.params.typeName;
  const setSearchArea = map => {
    if (map) {
      dispatch(setFiltersAndLoad({ ...activeFilters, map }));
    }
  };
  const setMapArea = ({ radius, coordinates }) => {
    if (isEmpty(activeFilters))
      dispatch(
        getObjectTypeMap(
          { radius, coordinates: normalizeCoordinates(coordinates) },
          isFullscreenMode,
        ),
      );
  };

  useEffect(() => {
    if (hasMap) {
      const currentSearch = history.location.search;
      const searchParams = new URLSearchParams(currentSearch);
      const mapX = searchParams.get('mapX');
      const mapY = searchParams.get('mapY');
      const radius = searchParams.get('radius');
      const zoom = searchParams.get('zoom');
      const currentMapParams =
        mapX && mapY ? `${mapX},${mapY},${radius || ''},${zoom || ''}` : null;
      const prevSearch = prevSearchRef.current;
      const prevSearchParams = prevSearch ? new URLSearchParams(prevSearch) : null;
      const prevMapX = prevSearchParams?.get('mapX');
      const prevMapY = prevSearchParams?.get('mapY');
      const prevMapParams =
        prevMapX && prevMapY
          ? `${prevMapX},${prevMapY},${prevSearchParams.get('radius') || ''},${prevSearchParams.get(
              'zoom',
            ) || ''}`
          : null;
      const mapParamsChanged = currentMapParams !== null && currentMapParams !== prevMapParams;
      // const isInitialLoad = !prevSearch && isEmpty(activeFilters);

      if (mapParamsChanged) {
        setMapArea({
          radius: mapSettings.radius,
          coordinates: normalizeCoordinates(mapSettings.coordinates),
          isMap: true,
          firstMapLoad: true,
        });
      }

      prevSearchRef.current = currentSearch;
    }
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
            userLocation={normalizeCoordinates(mapSettings.coordinates)}
            customControl={<Icon type="search" style={{ fontSize: '25px', color: '#000000' }} />}
            onCustomControlClick={handleMapSearchClick}
            match={match}
            zoomMap={mapSettings.zoom}
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
