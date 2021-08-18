import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { isEmpty, get, map, debounce, isEqual, reverse } from 'lodash';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { Map } from 'pigeon-maps';
import Overlay from 'pigeon-overlay';
import { getCoordinates } from '../../../../store/userStore/userActions';
import {
  setFilterFromQuery,
  setMapForSearch,
  setSearchInBox,
  setShowSearchResult,
  setWebsiteSearchType,
} from '../../../../store/searchStore/searchActions';
import SearchAllResult from '../../../search/SearchAllResult/SearchAllResult';
import mapProvider from '../../../helpers/mapProvider';
import { getParsedMap } from '../../../components/Maps/mapHelper';
import CustomMarker from '../../../components/Maps/CustomMarker';
import {
  getObjectAvatar,
  getObjectMapInArray,
  getObjectName,
} from '../../../helpers/wObjectHelper';
import { handleAddMapCoordinates } from '../../../rewards/rewardsHelper';
import {
  getCurrentAppSettings,
  getReservedCounter,
  putUserCoordinates,
} from '../../../../store/appStore/appActions';
import {
  getWebsiteObjWithCoordinates,
  setShowReload,
} from '../../../../store/websiteStore/websiteActions';
import { distanceInMBetweenEarthCoordinates, getFirstOffsetNumber } from '../../helper';
import ObjectOverlayCard from '../../../objectCard/ObjectOverlayCard/ObjectOverlayCard';
import {
  getConfigurationValues,
  getHostAddress,
  getReserveCounter,
  getScreenSize,
} from '../../../../store/appStore/appSelectors';
import { getIsAuthenticated } from '../../../../store/authStore/authSelectors';
import { getUserLocation } from '../../../../store/userStore/userSelectors';
import {
  getShowSearchResult,
  getWebsiteMap,
  getWebsiteSearchString,
  getWebsiteSearchType,
  tagsCategoryIsEmpty,
} from '../../../../store/searchStore/searchSelectors';
import {
  getShowReloadButton,
  getWobjectsPoint,
} from '../../../../store/websiteStore/websiteSelectors';
import { createFilterBody, parseTagsFilters } from '../../../discoverObjects/helper';
import MapControllers from '../../../widgets/MapControllers/MapControllers';
import TagFilters from '../../TagFilters/TagFilters';

import './WebsiteBody.less';

const WebsiteBody = props => {
  const [boundsParams, setBoundsParams] = useState({
    topPoint: [],
    bottomPoint: [],
  });
  const [infoboxData, setInfoboxData] = useState(null);
  const [hoveredCardPermlink, setHoveredCardPermlink] = useState('');
  const [height, setHeight] = useState('100%');
  const [showLocation, setShowLocation] = useState(false);
  const [area, setArea] = useState({ center: [], zoom: 11, bounds: [] });
  const reservedButtonClassList = classNames('WebsiteBody__reserved', {
    'WebsiteBody__reserved--withMobileFilters': props.isActiveFilters,
  });
  let queryCenter = props.query.get('center');
  const isMobile = props.screenSize === 'xsmall' || props.screenSize === 'small';
  const getCurrentConfig = config =>
    isMobile ? get(config, 'mobileMap', {}) : get(config, 'desktopMap', {});
  const mapClassList = classNames('WebsiteBody__map', { WebsiteBody__hideMap: props.isShowResult });
  let mapHeight = 'calc(100vh - 57px)';
  const mapRef = useRef();

  if (height && isMobile) mapHeight = `${height - 57}px`;

  const getCenter = config => get(getCurrentConfig(config), 'center');
  const getZoom = config => get(getCurrentConfig(config), 'zoom');
  const setCurrMapConfig = (center, zoom) => setArea({ center, zoom, bounds: [] });

  if (queryCenter) {
    queryCenter = queryCenter.split(',').map(item => Number(item));
  }

  useEffect(() => {
    if (mapRef.current && props.query.get('showPanel')) {
      const bounce = mapRef.current.getBounds();

      if (bounce.ne[0] && bounce.sw[0]) {
        props.setShowSearchResult(true);
        props.setMapForSearch({
          coordinates: reverse([...area.center]),
          topPoint: [bounce.ne[1], bounce.ne[0]],
          bottomPoint: [bounce.sw[1], bounce.sw[0]],
        });
      }
    }
  }, [mapRef.current]);

  const getCoordinatesForMap = async () => {
    let currZoom;
    let currCenter;

    if (!isEmpty(queryCenter)) {
      currZoom = +props.query.get('zoom');
      currCenter = queryCenter;
    } else {
      const currLocation = await props.getCoordinates();
      const res = await props.getCurrentAppSettings();
      const siteConfig = get(res, 'configuration');

      currZoom = getZoom(siteConfig) || 6;
      currCenter = getCenter(siteConfig);

      currCenter = isEmpty(currCenter)
        ? [get(currLocation, ['value', 'latitude']), get(currLocation, ['value', 'longitude'])]
        : currCenter;
    }

    setCurrMapConfig(currCenter, currZoom);

    return { currCenter, currZoom };
  };

  const handleSetMapForSearch = () => {
    if (!isEmpty(area.center)) {
      props.query.set('showPanel', true);
      props.query.set('center', area.center);
      props.query.set('zoom', area.zoom);

      props.setMapForSearch({
        coordinates: reverse([...area.center]),
        ...boundsParams,
      });
    }

    props.history.push(`?${props.query.toString()}`);
    localStorage.setItem('query', props.query.toString());
  };

  useEffect(() => {
    const query = props.location.search;
    const handleResize = () => setHeight(window.innerHeight);

    setHeight(window.innerHeight);

    if (props.isAuth) props.getReservedCounter();

    if (query) {
      const filterBody = createFilterBody(parseTagsFilters(query));
      const type = props.query.get('type');

      if (type) props.setWebsiteSearchType(type);
      if (!isEmpty(filterBody)) props.setFilterFromQuery(filterBody);
    }

    getCoordinatesForMap();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (props.isShowResult) {
      handleSetMapForSearch();
    } else {
      props.setMapForSearch({});
      props.setShowReload(false);
      props.setSearchInBox(true);
      props.history.push(`?${props.query.toString()}`);
    }
  }, [props.isShowResult]);

  useEffect(() => {
    const { topPoint, bottomPoint } = boundsParams;

    if (!isEmpty(topPoint) && !isEmpty(bottomPoint))
      props
        .getWebsiteObjWithCoordinates(props.searchString, { topPoint, bottomPoint }, 50)
        .then(res => {
          if (!isEmpty(props.searchMap)) {
            const distance = distanceInMBetweenEarthCoordinates(
              reverse([...props.searchMap.coordinates]),
              area.center,
            );

            if (distance > 20 && !props.showReloadButton) props.setShowReload(true);
            if (!distance) props.setShowReload(false);
          }
          if (!isEmpty(queryCenter)) {
            const { wobjects } = res.value;
            const queryPermlink = props.query.get('permlink');
            const currentPoint =
              get(infoboxData, ['wobject', 'author_permlink']) !== queryPermlink
                ? wobjects.find(wobj => wobj.author_permlink === queryPermlink)
                : null;

            if (currentPoint) {
              setInfoboxData({
                wobject: currentPoint,
                coordinates: queryCenter,
              });
            }
          }
        });
  }, [props.userLocation, boundsParams, props.query.toString()]);

  const aboutObject = get(props, ['configuration', 'aboutObject'], {});
  const configLogo = isMobile ? props.configuration.mobileLogo : props.configuration.desktopLogo;
  const currentLogo = configLogo || getObjectAvatar(aboutObject);
  const logoLink = get(aboutObject, ['defaultShowLink'], '/');
  const description = get(aboutObject, 'description', '');
  const objName = getObjectName(aboutObject);
  const title = get(aboutObject, 'title', '') || objName;

  const reloadSearchList = () => {
    handleSetMapForSearch();
    props.setShowReload(false);
  };

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
    if (!isEmpty(center)) setArea({ center, zoom, bounds });
    if (!isEqual(bounds, area.bounds)) handleOnBoundsChanged(bounds);
  };

  const handleHoveredCard = permlink => setHoveredCardPermlink(permlink);

  const handleMarkerClick = useCallback(
    ({ payload, anchor }) => {
      handleAddMapCoordinates(anchor);

      if (get(infoboxData, 'coordinates', []) === anchor) setInfoboxData({ infoboxData: null });

      props.query.set('center', anchor);
      props.query.set('zoom', area.zoom);
      props.query.set('permlink', payload.author_permlink);
      props.history.push(`?${props.query.toString()}`);
      setInfoboxData({ wobject: payload, coordinates: anchor });
    },
    [area.zoom, props.location.search],
  );

  const getMarkers = useCallback(
    wObjects =>
      !isEmpty(wObjects) &&
      map(wObjects, wobject => {
        const parsedMap = getParsedMap(wobject);
        const latitude = get(parsedMap, ['latitude']);
        const longitude = get(parsedMap, ['longitude']);
        const isMarked = Boolean(
          get(wobject, 'campaigns') || !isEmpty(get(wobject, 'propositions')),
        );

        return latitude && longitude ? (
          <CustomMarker
            key={get(wobject, '_id')}
            isMarked={isMarked}
            anchor={[+latitude, +longitude]}
            payload={wobject}
            onClick={handleMarkerClick}
            onDoubleClick={() => setInfoboxData(null)}
            hoveredWobj={hoveredCardPermlink === wobject.author_permlink}
          />
        ) : null;
      }),
    [props.wobjectsPoint, hoveredCardPermlink],
  );

  const getOverlayLayout = useCallback(() => {
    if (!infoboxData) return null;

    const currentWobj = infoboxData;
    const name = getObjectName(currentWobj.wobject);
    const wobject = get(currentWobj, 'wobject', {});
    const firstOffsetNumber = getFirstOffsetNumber(name);
    const setQueryInStorage = () => localStorage.setItem('query', props.query);

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

  const incrementZoom = () => setArea({ ...area, zoom: area.zoom + 1 });
  const decrementZoom = () => setArea({ ...area, zoom: area.zoom - 1 });
  const setLocationFromNavigator = position => {
    const { latitude, longitude } = position.coords;

    setArea({ ...area, center: [latitude, longitude] });
    setShowLocation(true);
    props.putUserCoordinates({ latitude, longitude });
  };

  const setLocationFromApi = () => {
    setShowLocation(false);
    setArea({
      ...area,
      center: [props.userLocation.lat, props.userLocation.lon],
    });
  };

  const handleSetFiltersInUrl = (category, value) => {
    if (value === 'all') props.query.delete(category);
    else props.query.set(category, value);

    props.history.push(`?${props.query.toString()}`);
  };

  const handleUrlWithChangeType = type => {
    let query = `?type=${type}&center=${area.center}&zoom=${area.zoom}`;

    if (props.searchString) query = `${query}&searchString=${props.searchString}`;

    setInfoboxData(null);
    props.history.push(query);
  };

  const setQueryFromSearchList = obj => {
    const objMap = getObjectMapInArray(obj);

    props.query.set('center', area.center);
    props.query.set('zoom', area.zoom);
    props.query.set('permlink', obj.author_permlink);

    if (objMap) props.query.set('center', objMap);
    if (props.searchString) props.query.set('searchString', props.searchString);
  };

  const setQueryInLocalStorage = () => localStorage.setItem('query', props.query.toString());

  const deleteShowPanel = () => {
    if (props.query.get('showPanel')) {
      props.query.delete('showPanel');
      props.history.push(`?${props.query.toString()}`);
    }
  };

  return (
    <div className="WebsiteBody">
      <Helmet>
        <title>{title ? `${objName} - ${title}` : objName}</title>
        <link rel="canonical" href={`https://${props.host}/`} />
        <meta property="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={global.postOrigin} />
        <meta property="og:image" content={currentLogo} />
        <meta property="og:image:url" content={currentLogo} />
        <meta property="og:image:width" content="600" />
        <meta property="og:image:height" content="600" />
        <meta property="og:description" content={description} />
        <meta name="twitter:card" content={currentLogo ? 'summary_large_image' : 'summary'} />
        <meta name="twitter:site" content={`@${objName}`} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" property="twitter:image" content={currentLogo} />
        <meta property="og:site_name" content={objName} />
        <link rel="image_src" href={currentLogo} />
        <link id="favicon" rel="icon" href={getObjectAvatar(aboutObject)} type="image/x-icon" />
      </Helmet>
      <SearchAllResult
        showReload={props.showReloadButton}
        reloadSearchList={reloadSearchList}
        searchType={props.searchType}
        handleHoveredCard={handleHoveredCard}
        handleSetFiltersInUrl={handleSetFiltersInUrl}
        handleUrlWithChangeType={handleUrlWithChangeType}
        setQueryInLocalStorage={setQueryInLocalStorage}
        setQueryFromSearchList={setQueryFromSearchList}
        deleteShowPanel={deleteShowPanel}
      />
      <div className={mapClassList} style={{ height: mapHeight }}>
        {currentLogo && (
          <Link to={logoLink}>
            <img className="WebsiteBody__logo" src={currentLogo} alt="your logo" />
          </Link>
        )}
        {!isEmpty(area.center) && !isEmpty(props.configuration) && (
          <React.Fragment>
            {Boolean(props.counter) && props.isAuth && (
              <Link to="/rewards/reserved" className={reservedButtonClassList}>
                <FormattedMessage id="reserved" defaultMessage="Reserved" />
                :&nbsp;&nbsp;&nbsp;&nbsp;{props.counter}
              </Link>
            )}
            <MapControllers
              className={'WebsiteBodyControl'}
              decrementZoom={decrementZoom}
              incrementZoom={incrementZoom}
              successCallback={setLocationFromNavigator}
              rejectCallback={setLocationFromApi}
            />
            <Map
              ref={mapRef}
              center={area.center}
              height={Number(mapHeight)}
              zoom={area.zoom}
              provider={mapProvider}
              onBoundsChanged={onBoundsChanged}
              onClick={({ event }) => {
                if (event.target.classList.value === 'pigeon-overlays') {
                  setInfoboxData(null);
                  props.query.delete('center');
                  props.query.delete('zoom');
                  props.query.delete('permlink');
                  props.history.push(`?${props.query.toString()}`);
                }
              }}
              animate
              zoomSnap
            >
              <TagFilters query={props.query} history={props.history} />
              {getMarkers(props.wobjectsPoint)}
              {getOverlayLayout()}
              {showLocation && (
                <CustomMarker
                  anchor={[props.userLocation.lat, props.userLocation.lon]}
                  currLocation
                />
              )}
            </Map>
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

WebsiteBody.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string,
    search: PropTypes.string,
  }).isRequired,
  match: PropTypes.shape({
    site: PropTypes.string,
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
  configuration: PropTypes.shape().isRequired,
  screenSize: PropTypes.string.isRequired,
  getWebsiteObjWithCoordinates: PropTypes.func.isRequired,
  searchString: PropTypes.string.isRequired,
  host: PropTypes.string.isRequired,
  getReservedCounter: PropTypes.func.isRequired,
  putUserCoordinates: PropTypes.func.isRequired,
  setMapForSearch: PropTypes.func.isRequired,
  setShowReload: PropTypes.func.isRequired,
  setSearchInBox: PropTypes.func.isRequired,
  setFilterFromQuery: PropTypes.func.isRequired,
  getCurrentAppSettings: PropTypes.func.isRequired,
  setWebsiteSearchType: PropTypes.func.isRequired,
  setShowSearchResult: PropTypes.func.isRequired,
  wobjectsPoint: PropTypes.arrayOf(PropTypes.shape({})),
  counter: PropTypes.number.isRequired,
  searchType: PropTypes.string.isRequired,
  isActiveFilters: PropTypes.bool.isRequired,
  showReloadButton: PropTypes.bool,
  searchMap: PropTypes.shape({
    coordinates: PropTypes.arrayOf(PropTypes.number),
  }).isRequired,
  isAuth: PropTypes.bool,
  query: PropTypes.shape({
    get: PropTypes.func,
    set: PropTypes.func,
    delete: PropTypes.func,
  }).isRequired,
};

WebsiteBody.defaultProps = {
  wobjectsPoint: [],
  searchString: '',
  isAuth: false,
  showReloadButton: false,
};

export default connect(
  (state, ownProps) => ({
    userLocation: getUserLocation(state),
    isShowResult: getShowSearchResult(state),
    configuration: getConfigurationValues(state),
    screenSize: getScreenSize(state),
    wobjectsPoint: getWobjectsPoint(state),
    counter: getReserveCounter(state),
    isAuth: getIsAuthenticated(state),
    query: new URLSearchParams(ownProps.location.search),
    searchString: getWebsiteSearchString(state),
    searchMap: getWebsiteMap(state),
    showReloadButton: getShowReloadButton(state),
    searchType: getWebsiteSearchType(state),
    host: getHostAddress(state),
    isActiveFilters: tagsCategoryIsEmpty(state),
  }),
  {
    getCoordinates,
    setWebsiteSearchType,
    getWebsiteObjWithCoordinates,
    getReservedCounter,
    putUserCoordinates,
    getCurrentAppSettings,
    setMapForSearch,
    setShowReload,
    setSearchInBox,
    setFilterFromQuery,
    setShowSearchResult,
  },
)(withRouter(WebsiteBody));
