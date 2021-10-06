import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import mapProvider from '../../helpers/mapProvider';
import { getParsedMap } from '../../components/Maps/mapHelper';
import CustomMarker from '../../components/Maps/CustomMarker';
import { getObjectName } from '../../helpers/wObjectHelper';
import { handleAddMapCoordinates } from '../../rewards/rewardsHelper';
import { getCurrentAppSettings, putUserCoordinates } from '../../../store/appStore/appActions';
import {
  getWebsiteObjWithCoordinates,
  setShowReload,
} from '../../../store/websiteStore/websiteActions';
import { distanceInMBetweenEarthCoordinates, getFirstOffsetNumber } from '../helper';
import ObjectOverlayCard from '../../objectCard/ObjectOverlayCard/ObjectOverlayCard';
import { getIsDiningGifts, getScreenSize } from '../../../store/appStore/appSelectors';
import { getUserLocation } from '../../../store/userStore/userSelectors';
import {
  getShowSearchResult,
  getWebsiteMap,
  getWebsiteSearchString,
  getWebsiteSearchType,
} from '../../../store/searchStore/searchSelectors';
import {
  getShowReloadButton,
  getWobjectsPoint,
} from '../../../store/websiteStore/websiteSelectors';
import MapControllers from '../../widgets/MapControllers/MapControllers';
import TagFilters from '../TagFilters/TagFilters';

import '../WebsiteLayoutComponents/Body/WebsiteBody.less';

const MainMap = React.memo(props => {
  const [boundsParams, setBoundsParams] = useState({
    topPoint: [],
    bottomPoint: [],
  });
  const [infoboxData, setInfoboxData] = useState(null);
  const [height, setHeight] = useState('100%');
  const [showLocation, setShowLocation] = useState(false);
  const [area, setArea] = useState([]);
  const [currZoom, setZoom] = useState(6);
  const [currCenter, setCenter] = useState([]);
  const query = new URLSearchParams(props.location.search);
  const headerHeight = props.isDining ? 125 : 57;
  let queryCenter = query.get('center');
  let mapHeight = `calc(100vh - ${headerHeight}px)`;
  const isMobile = props.screenSize === 'xsmall' || props.screenSize === 'small';
  const mapClassList = classNames('WebsiteBody__map', { WebsiteBody__hideMap: props.isShowResult });
  const mapRef = useRef();

  if (queryCenter) queryCenter = queryCenter.split(',').map(item => Number(item));
  if (isMobile) mapHeight = `${height - headerHeight}px`;

  const getCurrentConfig = config =>
    isMobile ? get(config, 'mobileMap', {}) : get(config, 'desktopMap', {});

  const getCenter = config => get(getCurrentConfig(config), 'center');
  const getZoom = config => get(getCurrentConfig(config), 'zoom');
  const setCurrMapConfig = (center, zoom) => {
    setCenter(center);
    setZoom(zoom);
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

    setCurrMapConfig(center, zoom);
  };

  const handleSetMapForSearch = () => {
    if (!isEmpty(currCenter)) {
      query.set('showPanel', true);
      query.set('center', currCenter);
      query.set('zoom', currZoom);
      props.setMapForSearch({
        coordinates: reverse([...currCenter]),
        ...boundsParams,
      });
    }

    props.history.push(`?${query.toString()}`);
    localStorage.setItem('query', query.toString());
  };

  const checkDistanceAndSetReload = useCallback(() => {
    if (!isEmpty(props.searchMap)) {
      const distance = distanceInMBetweenEarthCoordinates(
        reverse([...props.searchMap.coordinates]),
        currCenter,
      );

      if (distance > 20 && !props.showReloadButton) props.setShowReload(true);
      if (!distance) props.setShowReload(false);
    }
  }, [props.searchMap, props.showReloadButton, currCenter]);

  useEffect(() => {
    const handleResize = () => setHeight(window.innerHeight);

    setHeight(window.innerHeight);

    getCoordinatesForMap();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (mapRef.current && query.get('showPanel')) {
      const bounce = mapRef.current.getBounds();

      if (bounce.ne[0] && bounce.sw[0]) {
        props.setShowSearchResult(true);
        setBoundsParams({
          topPoint: [bounce.ne[1], bounce.ne[0]],
          bottomPoint: [bounce.sw[1], bounce.sw[0]],
        });
      }
    }
  }, [mapRef.current]);

  useEffect(() => {
    if (props.isShowResult) {
      handleSetMapForSearch();
    } else {
      props.setMapForSearch({});
      props.setShowReload(false);
      props.setSearchInBox(true);
      props.history.push(`?${query.toString()}`);
    }
  }, [props.isShowResult]);

  useEffect(() => {
    setInfoboxData(null);
  }, [props.searchType]);

  useEffect(() => {
    if (!props.showReloadButton) {
      props.setMapForSearch({
        coordinates: reverse([...currCenter]),
        ...boundsParams,
      });
    }
  }, [props.showReloadButton]);

  useEffect(() => {
    const { topPoint, bottomPoint } = boundsParams;

    if (!isEmpty(topPoint) && !isEmpty(bottomPoint)) {
      props
        .getWebsiteObjWithCoordinates(props.searchString, { topPoint, bottomPoint }, 80)
        .then(res => {
          checkDistanceAndSetReload();
          if (!isEmpty(queryCenter)) {
            const { wobjects } = res.value;
            const queryPermlink = props.query.get('permlink');
            const currentPoint =
              get(infoboxData, ['wobject', 'author_permlink']) !== queryPermlink
                ? wobjects.find(wobj => wobj.author_permlink === queryPermlink)
                : null;

            if (currentPoint && !infoboxData) {
              setInfoboxData({
                wobject: currentPoint,
                coordinates: queryCenter,
              });
            }
          }
        });
    }
  }, [props.userLocation, boundsParams, query.toString()]);

  const handleOnBoundsChanged = useCallback(
    debounce(data => {
      if (!isEmpty(data) && data.ne[0] && data.sw[0]) {
        setBoundsParams({
          topPoint: [data.ne[1], data.ne[0]],
          bottomPoint: [data.sw[1], data.sw[0]],
        });
      }
    }, 300),
    [],
  );

  const onBoundsChanged = ({ center, zoom, bounds }) => {
    if (!isEmpty(center)) {
      setArea(bounds);
      setCenter(center);
      setZoom(zoom);
    }
    if (!isEqual(bounds, area)) handleOnBoundsChanged(bounds);
  };

  const handleMarkerClick = useCallback(
    ({ payload, anchor }) => {
      handleAddMapCoordinates(anchor);

      if (get(infoboxData, 'coordinates', []) === anchor) setInfoboxData({ infoboxData: null });

      query.set('center', anchor);
      query.set('zoom', currZoom);
      query.set('permlink', payload.author_permlink);
      props.history.push(`?${query.toString()}`);
      setInfoboxData({ wobject: payload, coordinates: anchor });
    },
    [currZoom, props.location.search],
  );

  const resetInfoBox = () => setInfoboxData(null);

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
            price={get(wobject, 'campaigns.max_reward') || get(wobject, 'propositions[0].reward')}
          />
        );
      });
    },
    [props.wobjectsPoint, props.hoveredCardPermlink],
  );

  const getOverlayLayout = useCallback(() => {
    if (!infoboxData) return null;
    const currentWobj = infoboxData;
    const name = getObjectName(currentWobj.wobject);
    const wobject = get(currentWobj, 'wobject', {});
    const firstOffsetNumber = getFirstOffsetNumber(name);
    const setQueryInStorage = () => localStorage.setItem('query', query);

    return (
      <Overlay
        anchor={infoboxData.coordinates}
        offset={[firstOffsetNumber, 160]}
        className="WebsiteBody__overlay"
      >
        <div className="WebsiteBody__overlay-wrap" role="presentation" onClick={setQueryInStorage}>
          <ObjectOverlayCard wObject={wobject} showParent={props.searchType !== 'restaurant'} />
        </div>
      </Overlay>
    );
  }, [infoboxData]);

  const incrementZoom = useCallback(() => setZoom(prev => prev + 1), [currZoom]);

  const decrementZoom = useCallback(() => setZoom(prev => prev - 1), [currZoom]);

  const setLocationFromNavigator = position => {
    const { latitude, longitude } = position.coords;

    props.putUserCoordinates({ latitude, longitude });
    setShowLocation(true);
    setCenter([latitude, longitude]);
  };

  const setLocationFromApi = () => {
    setShowLocation(false);
    setCenter([props.userLocation.lat, props.userLocation.lon]);
  };

  const handleClickOnMap = ({ event }) => {
    if (event.target.classList.value === 'pigeon-overlays') {
      resetInfoBox();
      query.delete('center');
      query.delete('zoom');
      query.delete('permlink');
      props.history.push(`?${query.toString()}`);
    }
  };

  const overlay = useMemo(() => getOverlayLayout(), [infoboxData]);

  const markersList = useMemo(() => getMarkers(props.wobjectsPoint), [
    props.wobjectsPoint,
    props.hoveredCardPermlink,
  ]);

  return (
    !isEmpty(currCenter) &&
    currZoom && (
      <div className={mapClassList} style={{ height: mapHeight }}>
        <MapControllers
          className={'WebsiteBodyControl'}
          decrementZoom={decrementZoom}
          incrementZoom={incrementZoom}
          successCallback={setLocationFromNavigator}
          rejectCallback={setLocationFromApi}
        />
        <Map
          ref={mapRef}
          center={currCenter}
          height={Number(mapHeight)}
          zoom={currZoom}
          provider={mapProvider}
          onBoundsChanged={onBoundsChanged}
          onClick={handleClickOnMap}
          animate
          zoomSnap
        >
          <TagFilters query={query} history={props.history} />
          {markersList}
          {overlay}
          {showLocation && (
            <CustomMarker anchor={[props.userLocation.lat, props.userLocation.lon]} currLocation />
          )}
        </Map>
      </div>
    )
  );
});

MainMap.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string,
    search: PropTypes.string,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  getCoordinates: PropTypes.func.isRequired,
  userLocation: PropTypes.shape({
    lat: PropTypes.number,
    lon: PropTypes.number,
  }).isRequired,
  isShowResult: PropTypes.bool.isRequired,
  isDining: PropTypes.bool.isRequired,
  screenSize: PropTypes.string.isRequired,
  getWebsiteObjWithCoordinates: PropTypes.func.isRequired,
  searchString: PropTypes.string.isRequired,
  putUserCoordinates: PropTypes.func.isRequired,
  setMapForSearch: PropTypes.func.isRequired,
  setShowReload: PropTypes.func.isRequired,
  setSearchInBox: PropTypes.func.isRequired,
  getCurrentAppSettings: PropTypes.func.isRequired,
  setShowSearchResult: PropTypes.func.isRequired,
  wobjectsPoint: PropTypes.arrayOf(PropTypes.shape({})),
  searchType: PropTypes.string.isRequired,
  hoveredCardPermlink: PropTypes.string.isRequired,
  showReloadButton: PropTypes.bool,
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
    isDining: getIsDiningGifts(state),
  }),
  {
    getCoordinates,
    getWebsiteObjWithCoordinates,
    putUserCoordinates,
    getCurrentAppSettings,
    setMapForSearch,
    setShowReload,
    setSearchInBox,
    setShowSearchResult,
  },
)(withRouter(MainMap));
