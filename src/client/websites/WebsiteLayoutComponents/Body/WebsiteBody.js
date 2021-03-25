import React, { useCallback, useEffect, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { isEmpty, get, map, debounce, isEqual, size, reverse } from 'lodash';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { Tag } from 'antd';
import PropTypes, { arrayOf } from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import Map from 'pigeon-maps';
import Overlay from 'pigeon-overlay';
import {
  getConfigurationValues,
  getMapForMainPage,
  getScreenSize,
  getSearchFiltersTagCategory,
  getShowSearchResult,
  getUserLocation,
  getWobjectsPoint,
  getReservCounter,
  getIsAuthenticated,
  getWebsiteSearchString,
  getWebsiteMap,
  getShowReloadButton,
  getWebsiteSearchType,
} from '../../../reducers';
import { getCoordinates } from '../../../user/userActions';
import {
  setMapForSearch,
  setSearchInBox,
  setShowSearchResult,
  setWebsiteSearchFilter,
  setWebsiteSearchType,
} from '../../../search/searchActions';
import SearchAllResult from '../../../search/SearchAllResult/SearchAllResult';
import mapProvider from '../../../helpers/mapProvider';
import { getParsedMap } from '../../../components/Maps/mapHelper';
import CustomMarker from '../../../components/Maps/CustomMarker';
import { getObjectAvatar, getObjectName } from '../../../helpers/wObjectHelper';
import { handleAddMapCoordinates } from '../../../rewards/rewardsHelper';
import {
  getCurrentAppSettings,
  getReservedCounter,
  putUserCoordinates,
} from '../../../app/appActions';
import { getWebsiteObjWithCoordinates, setShowReload } from '../../websiteActions';
import { distanceInMBetweenEarthCoordinates } from '../../helper';
import ObjectOverlayCard from '../../../objectCard/ObjectOverlayCard/ObjectOverlayCard';

import './WebsiteBody.less';

const WebsiteBody = props => {
  const [boundsParams, setBoundsParams] = useState({
    topPoint: [],
    bottomPoint: [],
  });
  const [infoboxData, setInfoboxData] = useState(null);
  const [hoveredCardPermlink, setHoveredCardPermlink] = useState('');
  const [area, setArea] = useState({ center: [], zoom: 11, bounds: [] });
  const isActiveFilters = !isEmpty(props.activeFilters);
  const reservedButtonClassList = classNames('WebsiteBody__reserved', {
    'WebsiteBody__reserved--withMobileFilters': isActiveFilters,
  });
  let queryCenter = props.query.get('center');
  const isMobile = props.screenSize === 'xsmall' || props.screenSize === 'small';
  const getCurrentConfig = config =>
    isMobile ? get(config, 'mobileMap', {}) : get(config, 'desktopMap', {});
  const mapClassList = classNames('WebsiteBody__map', { WebsiteBody__hideMap: props.isShowResult });

  const getCenter = config => get(getCurrentConfig(config), 'center');
  const getZoom = config => get(getCurrentConfig(config), 'zoom');

  const setCurrMapConfig = (center, zoom) => setArea({ center, zoom, bounds: [] });
  if (queryCenter) {
    queryCenter = queryCenter.split(',').map(item => Number(item));
  }

  const getCoordinatesForMap = async () => {
    if (!isEmpty(queryCenter)) {
      const queryZoom = props.query.get('zoom');

      setCurrMapConfig(queryCenter, +queryZoom);
    } else {
      const currLocation = await props.getCoordinates();
      const res = await props.getCurrentAppSettings();
      const siteConfig = get(res, 'configuration');
      const zoom = getZoom(siteConfig) || 6;
      let center = getCenter(siteConfig);

      center = isEmpty(center)
        ? [get(currLocation, ['value', 'latitude']), get(currLocation, ['value', 'longitude'])]
        : center;

      setCurrMapConfig(center, zoom);
    }
  };

  const handleSetMapForSearch = () =>
    props.setMapForSearch({
      coordinates: reverse([...area.center]),
      ...boundsParams,
    });

  useEffect(() => {
    if (props.isAuth) props.getReservedCounter();
    getCoordinatesForMap();

    return () => props.setShowSearchResult(false);
  }, []);

  useEffect(() => {
    if (props.isShowResult) {
      handleSetMapForSearch();
    } else {
      props.setMapForSearch({});
      props.setShowReload(false);
      props.setSearchInBox(true);
    }
  }, [props.isShowResult]);

  const handleChangeType = () => {
    setInfoboxData(null);
    props.history.push('/');
  };

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
            const currentPoint = wobjects.find(
              wobj => wobj.author_permlink === props.query.get('permlink'),
            );

            if (currentPoint) {
              setInfoboxData({
                wobject: currentPoint,
                coordinates: queryCenter,
              });
            }
          }
        });
  }, [props.userLocation, boundsParams, props.searchString, props.searchType, props.activeFilters]);

  const aboutObject = get(props, ['configuration', 'aboutObject'], {});
  const configLogo = isMobile ? props.configuration.mobileLogo : props.configuration.desktopLogo;
  const currentLogo = configLogo || getObjectAvatar(aboutObject);
  const logoLink = get(aboutObject, ['defaultShowLink'], '/');
  const description = get({}, 'description');

  const reloadSearchList = () => {
    handleSetMapForSearch();
    props.setShowReload(false);
  };

  const handleOnBoundsChanged = useCallback(
    debounce(data => {
      if (!isEmpty(data) && data.ne[0] && data.sw[0]) {
        setBoundsParams({
          ...boundsParams,
          topPoint: [data.ne[1], data.ne[0]],
          bottomPoint: [data.sw[1], data.sw[0]],
        });
      }
    }, 300),
    [],
  );

  const onBoundsChanged = useCallback(
    debounce(({ center, zoom, bounds }) => {
      if (!isEmpty(center)) setArea({ center, zoom, bounds });
      if (!isEqual(bounds, area.bounds)) handleOnBoundsChanged(bounds);
    }, 300),
    [],
  );

  const handleHoveredCard = permlink => setHoveredCardPermlink(permlink);

  const handleMarkerClick = useCallback(
    ({ payload, anchor }) => {
      handleAddMapCoordinates(anchor);

      if (get(infoboxData, 'coordinates', []) === anchor) setInfoboxData({ infoboxData: null });

      props.history.push(
        `/?center=${anchor}&zoom=${area.zoom}&permlink=${payload.author_permlink}`,
      );
      setInfoboxData({ wobject: payload, coordinates: anchor });
    },
    [area.zoom],
  );

  const getMarkers = useCallback(
    wObjects =>
      !isEmpty(wObjects) &&
      map(wObjects, wobject => {
        const parsedMap = getParsedMap(wobject);
        const latitude = get(parsedMap, ['latitude']);
        const longitude = get(parsedMap, ['longitude']);
        const isMarked = get(wobject, 'campaigns') || !isEmpty(get(wobject, 'propositions'));

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

  const getOverlayLayout = () => {
    const currentWobj = infoboxData;
    const name = getObjectName(currentWobj.wobject);
    const wobject = get(currentWobj, 'wobject', {});

    const getFirstOffsetNumber = () => {
      const lengthMoreThanOrSame = number => size(name) <= number;

      if (lengthMoreThanOrSame(15)) return 125;
      if (lengthMoreThanOrSame(20)) return 160;
      if (lengthMoreThanOrSame(35)) return 180;

      return 170;
    };

    const firstOffsetNumber = getFirstOffsetNumber();

    return (
      <Overlay
        anchor={infoboxData.coordinates}
        offset={[firstOffsetNumber, 160]}
        className="WebsiteBody__overlay"
      >
        <div
          className="WebsiteBody__overlay-wrap"
          role="presentation"
          data-anchor={wobject.author_permlink}
          onClick={() => localStorage.setItem('query', props.query)}
        >
          <ObjectOverlayCard wObject={wobject} showParent={props.searchType !== 'restaurant'} />
        </div>
      </Overlay>
    );
  };

  const incrementZoom = () => setArea({ ...area, zoom: area.zoom + 1 });
  const decrementZoom = () => setArea({ ...area, zoom: area.zoom - 1 });

  const setCurrentLocation = () => {
    const nav = navigator.geolocation;
    nav.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setArea({
          ...area,
          center: [latitude, longitude],
        });
        props.putUserCoordinates({ latitude, longitude });
      },
      () =>
        setArea({
          ...area,
          center: [props.userLocation.lat, props.userLocation.lon],
        }),
    );
  };

  const zoomButtonsLayout = () => (
    <div className="WebsiteBodyControl">
      <div className="WebsiteBodyControl__gps">
        <div
          role="presentation"
          className="WebsiteBodyControl__locateGPS"
          onClick={setCurrentLocation}
        >
          <img src="/images/icons/aim.png" alt="aim" className="MapOS__locateGPS-button" />
        </div>
      </div>
      <div className="WebsiteBodyControl__zoom">
        <div
          role="presentation"
          className="WebsiteBodyControl__zoom__button"
          onClick={incrementZoom}
        >
          +
        </div>
        <div
          role="presentation"
          className="WebsiteBodyControl__zoom__button"
          onClick={decrementZoom}
        >
          -
        </div>
      </div>
    </div>
  );

  return (
    <div className="WebsiteBody">
      <Helmet>
        <title>
          {description
            ? `${getObjectName(aboutObject)} - ${description}`
            : getObjectName(aboutObject)}
        </title>
        <meta
          property="twitter:description"
          content="Waivio is an open distributed attention marketplace for business"
        />
        <link id="favicon" rel="icon" href={getObjectAvatar(aboutObject)} type="image/x-icon" />
      </Helmet>
      <SearchAllResult
        showReload={props.showReloadButton}
        reloadSearchList={reloadSearchList}
        searchType={props.searchType}
        handleHoveredCard={handleHoveredCard}
        handleChangeType={handleChangeType}
      />
      <div className={mapClassList}>
        {currentLogo && (
          // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
          <img
            className="WebsiteBody__logo"
            srcSet={currentLogo}
            alt="your logo"
            styleName="brain-image"
            onClick={() => props.history.push(logoLink)}
          />
        )}
        {!isEmpty(area.center) && !isEmpty(props.configuration) && (
          <React.Fragment>
            {Boolean(props.counter) && props.isAuth && (
              <Link to="/rewards/reserved" className={reservedButtonClassList}>
                <FormattedMessage id="reserved" defaultMessage="Reserved" />
                :&nbsp;&nbsp;&nbsp;&nbsp;{props.counter}
              </Link>
            )}
            {zoomButtonsLayout()}
            <Map
              center={area.center}
              zoom={area.zoom}
              provider={mapProvider}
              onBoundsChanged={data => onBoundsChanged(data)}
              onClick={({ event }) => {
                if (!get(event, 'target.dataset.anchor')) {
                  setInfoboxData(null);
                  props.history.push('/');
                }
              }}
            >
              {isActiveFilters && (
                <div className="WebsiteBody__filters-list">
                  {props.activeFilters.map(filter =>
                    filter.tags.map(tag => (
                      <Tag
                        key={tag}
                        closable
                        onClose={() => props.setWebsiteSearchFilter(filter.categoryName, 'all')}
                      >
                        {tag}
                      </Tag>
                    )),
                  )}
                </div>
              )}
              {getMarkers(props.wobjectsPoint)}
              {infoboxData && getOverlayLayout()}
              <CustomMarker
                anchor={[props.userLocation.lat, props.userLocation.lon]}
                currLocation
              />
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
  setWebsiteSearchFilter: PropTypes.func.isRequired,
  getReservedCounter: PropTypes.func.isRequired,
  putUserCoordinates: PropTypes.func.isRequired,
  setMapForSearch: PropTypes.func.isRequired,
  setShowReload: PropTypes.func.isRequired,
  setSearchInBox: PropTypes.func.isRequired,
  setShowSearchResult: PropTypes.func.isRequired,
  getCurrentAppSettings: PropTypes.func.isRequired,
  wobjectsPoint: PropTypes.arrayOf(PropTypes.shape()),
  // eslint-disable-next-line react/no-unused-prop-types
  configCoordinates: PropTypes.arrayOf().isRequired,
  activeFilters: PropTypes.arrayOf().isRequired,
  counter: PropTypes.number.isRequired,
  searchType: PropTypes.string.isRequired,
  showReloadButton: PropTypes.bool,
  searchMap: PropTypes.shape({
    coordinates: arrayOf(PropTypes.number),
  }).isRequired,
  isAuth: PropTypes.bool,
  query: PropTypes.shape({
    get: PropTypes.func,
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
    configCoordinates: getMapForMainPage(state),
    activeFilters: getSearchFiltersTagCategory(state),
    counter: getReservCounter(state),
    isAuth: getIsAuthenticated(state),
    query: new URLSearchParams(ownProps.location.search),
    searchString: getWebsiteSearchString(state),
    searchMap: getWebsiteMap(state),
    showReloadButton: getShowReloadButton(state),
    searchType: getWebsiteSearchType(state),
  }),
  {
    getCoordinates,
    setWebsiteSearchType,
    getWebsiteObjWithCoordinates,
    setWebsiteSearchFilter,
    getReservedCounter,
    putUserCoordinates,
    getCurrentAppSettings,
    setMapForSearch,
    setShowReload,
    setShowSearchResult,
    setSearchInBox,
  },
)(withRouter(WebsiteBody));
