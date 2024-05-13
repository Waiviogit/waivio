import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import { isEmpty, get, map, debounce, isEqual, reverse } from 'lodash';

import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { Map } from 'pigeon-maps';
import Overlay from 'pigeon-overlay';
import { getCoordinates } from '../../../store/userStore/userActions';
import {
  setMapForSearch,
  setSearchInBox,
  setShowSearchResult,
} from '../../../store/searchStore/searchActions';
import mapProvider from '../../../common/helpers/mapProvider';
import { getParsedMap } from '../../components/Maps/mapHelpers';
import CustomMarker from '../../components/Maps/CustomMarker';
import { getObjectName } from '../../../common/helpers/wObjectHelper';
import { handleAddMapCoordinates } from '../../rewards/rewardsHelper';
import { getCurrentAppSettings, putUserCoordinates } from '../../../store/appStore/appActions';
import {
  getWebsiteObjWithCoordinates,
  resetWebsiteObjectsCoordinates,
  setMapInitialised,
  setShowReload,
  setSocialSearchResults,
} from '../../../store/websiteStore/websiteActions';
import { distanceInMBetweenEarthCoordinates, getFirstOffsetNumber } from '../helper';
import ObjectOverlayCard from '../../components/Maps/Overlays/ObjectOverlayCard/ObjectOverlayCard';
import { getScreenSize } from '../../../store/appStore/appSelectors';
import { getUserLocation } from '../../../store/userStore/userSelectors';
import {
  getShowSearchResult,
  getWebsiteMap,
  getWebsiteSearchString,
  getWebsiteSearchType,
} from '../../../store/searchStore/searchSelectors';
import {
  getShowReloadButton,
  getSocialSearchResultLoading,
  getWobjectsPoint,
} from '../../../store/websiteStore/websiteSelectors';
import MapControllers from '../../widgets/MapControllers/MapControllers';
import TagFilters from '../TagFilters/TagFilters';
import PostOverlayCard from '../../components/Maps/Overlays/PostOverlayCard/PostOverlayCard';
import { getObject } from '../../../store/wObjectStore/wObjectSelectors';
import { getObject as getObjectAction } from '../../../store/wObjectStore/wobjectsActions';
import Loading from '../../components/Icon/Loading';
import '../WebsiteLayoutComponents/Body/WebsiteBody.less';
import {
  setArea,
  setBoundsParams,
  setHeight,
  setInfoboxData,
  setMapData,
  setMapLoading,
  setShowLocation,
} from '../../../store/mapStore/mapActions';
import {
  getArea,
  getBoundsParams,
  getInfoboxData,
  getMapData,
  getMapHeight,
  getShowLocation,
} from '../../../store/mapStore/mapSelectors';

const MainMap = React.memo(props => {
  const query = new URLSearchParams(props.location.search);
  const headerHeight = 132;
  let queryCenter = query.get('center');
  let mapHeight = `calc(100vh - ${headerHeight}px)`;
  const isMobile = props.screenSize === 'xsmall' || props.screenSize === 'small';
  const mapClassList = classNames('WebsiteBody__map', { WebsiteBody__hideMap: props.isShowResult });
  const mapRef = useRef();
  // const abortController = useRef(null);

  if (queryCenter) queryCenter = queryCenter.split(',').map(item => Number(item));
  if (isMobile) mapHeight = props.isSocial ? `${props.height - 100}px` : `${props.height - 205}px`;

  const getCurrentConfig = config =>
    isMobile ? get(config, 'mobileMap', {}) : get(config, 'desktopMap', {});

  const getCenter = config => get(getCurrentConfig(config), 'center');
  const getZoom = config => get(getCurrentConfig(config), 'zoom');
  const setCurrMapConfig = (center, zoom) => {
    props.setMapLoading(false);
    props.setMapData({ center, zoom });
  };

  const getCoordinatesForMap = async () => {
    let zoom = +query.get('zoom');
    let center = queryCenter;

    if (isEmpty(queryCenter)) {
      const currLocation = await props.getCoordinates();
      const res = await props.getCurrentAppSettings();
      const siteConfig = get(res, 'configuration');

      zoom = getZoom(siteConfig) || 6;
      center = getCenter(siteConfig);
      center = isEmpty(center)
        ? [get(currLocation, ['value', 'latitude']), get(currLocation, ['value', 'longitude'])]
        : center;
    }
    if (props.isSocial) {
      const mapDesktopView = !isEmpty(props.wobject?.mapDesktopView)
        ? JSON.parse(props.wobject?.mapDesktopView)
        : undefined;
      const mapMobileView = !isEmpty(props.wobject?.mapMobileView)
        ? JSON.parse(props.wobject?.mapMobileView)
        : undefined;
      const mapView = isMobile ? mapMobileView : mapDesktopView;

      center = query.size > 0 ? center : mapView?.center || center;
      zoom = query.size > 0 ? zoom : mapView?.zoom || zoom;
    }

    setCurrMapConfig(center, zoom);
  };

  const handleSetMapForSearch = () => {
    const currCenter = props.mapData.center;

    if (!isEmpty(currCenter)) {
      query.set('showPanel', true);
      query.set('center', currCenter);
      query.set('zoom', props.mapData.zoom);
      props.setMapForSearch({
        coordinates: reverse([...currCenter]),
        ...props.boundsParams,
      });
    }

    props.history.push(`?${query.toString()}`);
    localStorage.setItem('query', query.toString());
  };

  const dataToChange = [props.searchMap, props.showReloadButton, props.mapData.center];

  if (props.isSocial) {
    dataToChange.push(
      ...[
        props.mapData.zoom,
        // props.searchMap.topPoint,props.searchMap.bottomPoint
      ],
    );
  }

  const checkDistanceAndSetReload = useCallback(() => {
    if (!isEmpty(props.searchMap)) {
      const distance = distanceInMBetweenEarthCoordinates(
        reverse([...props.searchMap.coordinates]),
        props.mapData.center,
      );

      if (props.isSocial && props.socialLoading) props.setShowReload(false);
      if ((distance > 20 && !props.showReloadButton) || (props.isSocial && !props.socialLoading))
        props.setShowReload(true);
      if (!distance && !props.isSocial) props.setShowReload(false);
    }
  }, [dataToChange]);

  useEffect(
    // eslint-disable-next-line consistent-return
    () => {
      if (typeof window !== 'undefined') {
        const handleResize = () => props.setHeight(window.innerHeight);

        props.setHeight(window.innerHeight);
        props.locale && getCoordinatesForMap();

        window.addEventListener('resize', handleResize);

        return () => {
          if (props.isSocial) {
            props.setMapInitialised(true);
          }
          window.removeEventListener('resize', handleResize);
        };
      }
    },
    [props.wobject.author_permlink],
  );

  useEffect(() => {
    if (
      (mapRef.current && query.get('showPanel')) ||
      (props.isSocial && mapRef.current) ||
      (mapRef.current && !props.isSocial && props.history.location.pathname === '/')
    ) {
      const bounce = mapRef.current.getBounds();

      if (bounce.ne[0] && bounce.sw[0]) {
        if ((!isMobile && props.isSocial) || !props.isSocial) props.setShowSearchResult(true);
        props.setBoundsParams({
          topPoint: [bounce.ne[1], bounce.ne[0]],
          bottomPoint: [bounce.sw[1], bounce.sw[0]],
        });
      }
    }
  }, [mapRef.current]);

  useEffect(() => {
    if (!props.isSocial) {
      if (props.isShowResult) {
        handleSetMapForSearch();
      } else {
        props.setMapForSearch({});
        props.setShowReload(false);
        props.setSearchInBox(true);
        props.history.push(`?${query.toString()}`);
      }
    }
  }, [props.isShowResult]);

  useEffect(() => {
    props.setInfoboxData(null);
    props.resetWebsiteObjectsCoordinates();
  }, [props.searchType]);

  useEffect(() => {
    if (!props.showReloadButton) {
      props.setMapForSearch({
        coordinates: reverse([...props.mapData.center]),
        ...props.boundsParams,
      });
    }
  }, [props.showReloadButton]);

  const fetchData = () => {
    const { topPoint, bottomPoint } = props.boundsParams;

    if (!isEmpty(topPoint) && !isEmpty(bottomPoint)) {
      const searchString = props.isSocial
        ? props.permlink ||
          props.match.params.name ||
          props.wobject.author_permlink ||
          query.get('currObj')
        : props.searchString;

      searchString &&
        props
          .getWebsiteObjWithCoordinates(props.isSocial, searchString, { topPoint, bottomPoint }, 80)
          .then(res => {
            checkDistanceAndSetReload();
            if (!isEmpty(queryCenter)) {
              const { wobjects } = res.value;
              const queryPermlink = props.isSocial
                ? query.get('permlink')
                : props.query.get('permlink');
              const currentPoint =
                get(props.infoboxData, ['wobject', 'author_permlink']) !== queryPermlink
                  ? wobjects.find(wobj => wobj.author_permlink === queryPermlink)
                  : null;

              if (currentPoint && !props.infoboxData) {
                props.setInfoboxData({
                  wobject: currentPoint,
                  coordinates: queryCenter,
                });
              }
            }
          });
    }
  };

  useEffect(() => {
    if (!props.isSocial) fetchData();
  }, [props.userLocation, props.boundsParams, props.searchType]);

  useEffect(() => {
    let mount = true;
    const permlink = query.get('currObj') || props.permlink || props.match.params.name;

    if ((permlink && (isEmpty(props.wobject) || props.wobject.object_type !== 'map')) || mount) {
      props.getObjectAction(permlink);
    }

    if (props.isSocial && mount) {
      fetchData();
    }

    return () => {
      mount = false;
      if (props.isSocial) {
        props.setMapInitialised(true);
      }
    };
  }, [props.boundsParams, props.match.params.name, props.locale]);

  const handleOnBoundsChanged = useCallback(
    debounce(bounds => {
      if (!isEmpty(bounds) && bounds.ne[0] && bounds.sw[0]) {
        props.setBoundsParams({
          topPoint: [bounds.ne[1], bounds.ne[0]],
          bottomPoint: [bounds.sw[1], bounds.sw[0]],
        });
      }
    }, 500),
    [],
  );

  const onBoundsChanged = ({ center, zoom, bounds }) => {
    props.setArea(bounds);
    props.setMapData({ zoom, center });

    if (!isEqual(bounds, props.area)) handleOnBoundsChanged(bounds);
  };

  const handleMarkerClick = useCallback(
    ({ payload, anchor }) => {
      handleAddMapCoordinates(anchor);

      if (get(props.infoboxData, 'coordinates', []) === anchor) props.setInfoboxData(null);

      query.set('center', anchor);
      query.set('zoom', props.mapData.zoom);
      query.set('permlink', payload.author_permlink);
      if (props.isSocial && props.location.pathname === '/') {
        query.set('currObj', props.wobject.author_permlink);
      }
      props.history.push(`?${query.toString()}`);
      props.setInfoboxData({ wobject: payload, coordinates: anchor });
    },
    [props.mapData.zoom, props.location.search, props.isSocial, props.wobject],
  );

  const resetInfoBox = () => props.setInfoboxData(null);

  const getMarkers = useCallback(
    wObjects => {
      if (isEmpty(wObjects)) return null;

      return map(wObjects, wobject => {
        const parsedMap = getParsedMap(wobject);
        const latitude = get(parsedMap, ['latitude']);
        const longitude = get(parsedMap, ['longitude']);

        if (!latitude && !longitude) return null;

        const isMarked = Boolean(
          get(wobject, 'campaigns') || !isEmpty(get(wobject, 'propositions')),
        );
        const hoveredWobj = props.hoveredCardPermlink === wobject.author_permlink;
        const anchor = [+latitude, +longitude];

        return (
          <CustomMarker
            key={get(wobject, '_id')}
            isMarked={isMarked}
            anchor={anchor}
            payload={wobject}
            onClick={handleMarkerClick}
            onDoubleClick={resetInfoBox}
            hoveredWobj={hoveredWobj}
          />
        );
      });
    },
    [props.wobjectsPoint, props.hoveredCardPermlink, props.location.search],
  );

  const getOverlayLayout = useCallback(() => {
    if (!props.infoboxData) return null;
    const currentWobj = props.infoboxData;
    const name = getObjectName(currentWobj.wobject);
    const wobject = get(currentWobj, 'wobject', {});
    const firstOffsetNumber = getFirstOffsetNumber(name);
    const setQueryInStorage = () => localStorage.setItem('query', query);
    const usersType = props.searchType === 'Users';
    const offset = usersType ? [80, 240] : [firstOffsetNumber, 160];

    return (
      <Overlay
        anchor={props.infoboxData.coordinates}
        offset={offset}
        className="WebsiteBody__overlay"
      >
        <div className="WebsiteBody__overlay-wrap" role="presentation" onClick={setQueryInStorage}>
          {usersType ? (
            <PostOverlayCard wObject={wobject} />
          ) : (
            <ObjectOverlayCard
              isMapObj
              wObject={wobject}
              showParent={props.searchType !== 'restaurant'}
            />
          )}
        </div>
      </Overlay>
    );
  }, [props.infoboxData]);

  const incrementZoom = useCallback(() => {
    if (props.mapData.zoom < 18)
      props.setMapData({ ...props.mapData, zoom: props.mapData.zoom + 1 });
  }, [props.mapData]);

  const decrementZoom = useCallback(() => {
    if (props.mapData.zoom > 1)
      props.setMapData({ ...props.mapData, zoom: props.mapData.zoom - 1 });
  }, [props.mapData]);

  const setLocationFromNavigator = position => {
    const { latitude, longitude } = position.coords;

    props.putUserCoordinates({ latitude, longitude });
    props.setShowLocation(true);
    props.setMapData({ center: [latitude, longitude], zoom: props.mapData.zoom });
  };

  const setLocationFromApi = () => {
    props.setShowLocation(false);
    props.setMapData({
      center: [props.userLocation.lat, props.userLocation.lon],
      zoom: props.mapData.zoom,
    });
  };

  const handleClickOnMap = ({ event }) => {
    if (event.target.classList.value === 'pigeon-overlays') {
      resetInfoBox();
      query.delete('center');
      query.delete('zoom');
      query.delete('permlink');
      query.delete('currObj');
      props.history.push(`?${query.toString()}`);
    }
  };

  const overlay = useMemo(() => getOverlayLayout(), [props.infoboxData]);

  const markersList = useMemo(() => getMarkers(props.wobjectsPoint), [
    props.wobjectsPoint,
    props.hoveredCardPermlink,
  ]);

  if (props.loading && props.isSocial) {
    return <Loading />;
  }

  return (
    !isEmpty(props.mapData.center) &&
    props.mapData.zoom && (
      <div className={mapClassList} style={{ height: mapHeight }}>
        <Map
          ref={mapRef}
          center={props.mapData.center}
          height={Number(mapHeight)}
          zoom={props.mapData.zoom}
          provider={mapProvider}
          onBoundsChanged={onBoundsChanged}
          onClick={handleClickOnMap}
        >
          <TagFilters query={query} history={props.history} />
          {markersList}
          {overlay}
          {props.showLocation && (
            <CustomMarker anchor={[props.userLocation.lat, props.userLocation.lon]} currLocation />
          )}
        </Map>
        <MapControllers
          isMapObjType
          className={props.isSocial ? 'WebsiteBodyControl--social' : 'WebsiteBodyControl'}
          decrementZoom={decrementZoom}
          incrementZoom={incrementZoom}
          successCallback={setLocationFromNavigator}
          rejectCallback={setLocationFromApi}
        />
      </div>
    )
  );
});

MainMap.propTypes = {
  match: PropTypes.shape(),
  wobject: PropTypes.shape(),
  location: PropTypes.shape({
    pathname: PropTypes.string,
    search: PropTypes.string,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
    location: PropTypes.shape(),
  }).isRequired,
  getCoordinates: PropTypes.func.isRequired,
  userLocation: PropTypes.shape({
    lat: PropTypes.number,
    lon: PropTypes.number,
  }).isRequired,
  isShowResult: PropTypes.bool.isRequired,
  screenSize: PropTypes.string.isRequired,
  locale: PropTypes.string,
  getWebsiteObjWithCoordinates: PropTypes.func.isRequired,
  searchString: PropTypes.string.isRequired,
  putUserCoordinates: PropTypes.func.isRequired,
  setMapForSearch: PropTypes.func.isRequired,
  setShowReload: PropTypes.func.isRequired,
  setSearchInBox: PropTypes.func.isRequired,
  resetWebsiteObjectsCoordinates: PropTypes.func.isRequired,
  getCurrentAppSettings: PropTypes.func.isRequired,
  setMapLoading: PropTypes.func.isRequired,
  getObjectAction: PropTypes.func.isRequired,
  setShowSearchResult: PropTypes.func.isRequired,
  setMapInitialised: PropTypes.func.isRequired,
  wobjectsPoint: PropTypes.arrayOf(PropTypes.shape({})),
  searchType: PropTypes.string.isRequired,
  hoveredCardPermlink: PropTypes.string.isRequired,
  showReloadButton: PropTypes.bool,
  isSocial: PropTypes.bool,
  loading: PropTypes.bool,
  socialLoading: PropTypes.bool,
  mapData: PropTypes.shape(),
  setMapData: PropTypes.func.isRequired,
  height: PropTypes.string,
  permlink: PropTypes.string,
  setHeight: PropTypes.func.isRequired,
  boundsParams: PropTypes.shape().isRequired,
  setBoundsParams: PropTypes.func.isRequired,
  infoboxData: PropTypes.shape(),
  setInfoboxData: PropTypes.func.isRequired,
  area: PropTypes.arrayOf(),
  setArea: PropTypes.func.isRequired,
  showLocation: PropTypes.bool.isRequired,
  setShowLocation: PropTypes.func.isRequired,
  searchMap: PropTypes.shape({
    coordinates: PropTypes.arrayOf(PropTypes.number),
  }).isRequired,
  query: PropTypes.shape({
    get: PropTypes.func,
    set: PropTypes.func,
    delete: PropTypes.func,
  }).isRequired,
};

MainMap.defaultProps = {
  wobjectsPoint: [],
  searchString: '',
  showReloadButton: false,
};

export default connect(
  state => ({
    userLocation: getUserLocation(state),
    isShowResult: getShowSearchResult(state),
    screenSize: getScreenSize(state),
    wobjectsPoint: getWobjectsPoint(state),
    searchString: getWebsiteSearchString(state),
    searchMap: getWebsiteMap(state),
    showReloadButton: getShowReloadButton(state),
    searchType: getWebsiteSearchType(state),
    wobject: getObject(state),
    socialLoading: getSocialSearchResultLoading(state),
    mapData: getMapData(state),
    height: getMapHeight(state),
    boundsParams: getBoundsParams(state),
    infoboxData: getInfoboxData(state),
    showLocation: getShowLocation(state),
    area: getArea(state),
  }),
  {
    getCoordinates,
    getWebsiteObjWithCoordinates,
    resetWebsiteObjectsCoordinates,
    putUserCoordinates,
    getCurrentAppSettings,
    setMapForSearch,
    setShowReload,
    setSearchInBox,
    setShowSearchResult,
    setSocialSearchResults,
    setMapInitialised,
    getObjectAction,
    setMapData,
    setHeight,
    setBoundsParams,
    setInfoboxData,
    setShowLocation,
    setArea,
    setMapLoading,
  },
)(withRouter(MainMap));
