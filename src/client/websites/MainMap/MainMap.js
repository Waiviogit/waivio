import React, { useCallback, useEffect, useRef, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { isEmpty, get, reverse } from 'lodash';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { getCoordinates } from '../../../store/userStore/userActions';
import {
  setMapForSearch,
  setSearchInBox,
  setShowSearchResult,
} from '../../../store/searchStore/searchActions';
import { getCurrentAppSettings, putUserCoordinates } from '../../../store/appStore/appActions';
import {
  getWebsiteObjWithCoordinates,
  resetWebsiteObjectsCoordinates,
  setShowReload,
  setSocialSearchResults,
} from '../../../store/websiteStore/websiteActions';
import { distanceInMBetweenEarthCoordinates } from '../helper';
import { getScreenSize, getUserAdministrator } from '../../../store/appStore/appSelectors';
import { getUserLocation } from '../../../store/userStore/userSelectors';
import {
  getShowSearchResult,
  getWebsiteMap,
  getWebsiteSearchString,
  getWebsiteSearchType,
} from '../../../store/searchStore/searchSelectors';
import {
  getSettingsSite,
  getShowReloadButton,
  getSocialSearchResultLoading,
  getWobjectsPoint,
} from '../../../store/websiteStore/websiteSelectors';
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
import {
  getAuthenticatedUserName,
  getGuestAuthority,
  getIsAuthenticated,
  getIsConnectMatchBot,
  isGuestUser,
} from '../../../store/authStore/authSelectors';
import MainMapView from './MainMapView';
import { MATCH_BOTS_TYPES } from '../../../common/helpers/matchBotsHelpers';
import MapObjectImport from '../MapObjectImport/MapObjectImport';
import { getGuestAuthorityStatus } from '../../../store/authStore/authActions';
import { hasAccessToImport } from '../../../waivioApi/importApi';

const MainMap = React.memo(props => {
  const [showImportModal, setShowImportModal] = useState(false);
  const [usersState, setUsersState] = useState(null);
  const query = new URLSearchParams(props.location.search);
  const headerHeight = 132;
  let queryCenter = query.get('center');
  let mapHeight = `calc(100vh - ${headerHeight}px)`;
  const isMobile = props.screenSize === 'xsmall' || props.screenSize === 'small';
  const mapClassList = classNames('WebsiteBody__map', { WebsiteBody__hideMap: props.isShowResult });
  const mapRef = useRef();
  // const abortController = useRef(null);

  if (queryCenter) queryCenter = queryCenter.split(',').map(item => Number(item));
  if (isMobile)
    mapHeight =
      props.isSocial || props.isUserMap ? `${props.height - 100}px` : `${props.height - 205}px`;

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
    if (props.isUserMap) {
      zoom = query.size > 0 ? +query.get('zoom') : 3;
      center = query.size > 0 ? queryCenter : [45.156566468001685, -48.77765737781775];
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

  const setShowImport = () => {
    setShowImportModal(true);
  };
  const closeImportModal = () => {
    setShowImportModal(false);
  };
  const checkDistanceAndSetReload = useCallback(() => {
    if (!isEmpty(props.searchMap)) {
      const distance = distanceInMBetweenEarthCoordinates(
        reverse([...props.searchMap.coordinates]),
        props.mapData.center,
      );

      if ((props.isSocial || props.isUserMap) && props.socialLoading) props.setShowReload(false);
      if (
        (distance > 20 && !props.showReloadButton) ||
        ((props.isSocial || props.isUserMap) && !props.socialLoading)
      )
        props.setShowReload(true);
      if (!distance && !props.isSocial && !props.isUserMap) props.setShowReload(false);
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
          window.removeEventListener('resize', handleResize);
        };
      }
    },
    [props.wobject.author_permlink, props.user],
  );
  useEffect(() => {
    props.isAuth && hasAccessToImport(props.authUserName).then(r => setUsersState(r));
  }, []);

  useEffect(() => {
    if (
      (mapRef.current && query.get('showPanel')) ||
      (props.isSocial && mapRef.current) ||
      (props.isUserMap && mapRef.current) ||
      (mapRef.current && !props.isSocial && props.history.location.pathname === '/')
    ) {
      const bounce = mapRef.current.getBounds();

      if (bounce.ne[0] && bounce.sw[0]) {
        if (
          (!isMobile && (props.isSocial || props.isUserMap)) ||
          (!props.isSocial && !props.isUserMap)
        )
          props.setShowSearchResult(true);
        props.setBoundsParams({
          topPoint: [bounce.ne[1], bounce.ne[0]],
          bottomPoint: [bounce.sw[1], bounce.sw[0]],
        });
      }
    }
  }, [mapRef.current]);

  useEffect(() => {
    if (!props.isSocial && !props.isUserMap) {
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
        ? props.permlink || props.user || props.wobject.author_permlink || query.get('currObj')
        : props.searchString;

      if ((searchString && props.isSocial) || !props.isSocial)
        props
          .getWebsiteObjWithCoordinates(
            props.isSocial,
            searchString,
            { topPoint, bottomPoint },
            props.isUserMap,
            props.user,
            100,
          )
          .then(res => {
            checkDistanceAndSetReload();
            if (!isEmpty(queryCenter)) {
              const { wobjects } = res.value;
              const queryPermlink =
                props.isSocial || props.isUserMap
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
    if (!props.isSocial && !props.isUserMap) fetchData();
  }, [props.userLocation, props.boundsParams, props.searchType]);

  useEffect(() => {
    let mount = true;
    const permlink = query.get('currObj') || props.permlink || props.user;

    if (
      permlink &&
      !props.isUserMap &&
      (isEmpty(props.wobject) || props.wobject.object_type !== 'map')
    ) {
      props.getObjectAction(permlink);
    }

    if ((props.isSocial || props.isUserMap) && mount) {
      fetchData();
    }

    return () => {
      mount = false;
    };
  }, [props.boundsParams, props.user, props.locale]);
  if (isEmpty(props.mapData.center) && props.isSocial) {
    return <Loading />;
  }

  return (
    <>
      <MainMapView
        settings={props.settings}
        isAdmin={props.isAdmin}
        isAuth={props.isAuth}
        isUserMap={props.isUserMap}
        hoveredCardPermlink={props.hoveredCardPermlink}
        wobject={props.wobject}
        isSocial={props.isSocial}
        infoboxData={props.infoboxData}
        area={props.area}
        setArea={props.setArea}
        setBoundsParams={props.setBoundsParams}
        setInfoboxData={props.setInfoboxData}
        showLocation={props.showLocation}
        showMap={
          ((!props.isSocial && !isEmpty(props.mapData.center)) || props.isSocial) &&
          props.mapData.zoom
        }
        setShowLocation={props.setShowLocation}
        setMapData={props.setMapData}
        mapClassList={mapClassList}
        query={query}
        mapData={props.mapData}
        putUserCoordinates={props.putUserCoordinates}
        history={props.history}
        mapRef={mapRef}
        mapHeight={mapHeight}
        showImport={setShowImport}
        mapControllersClassName={classNames('WebsiteBodyControl', {
          'WebsiteBodyControl--social': props.isSocial,
          'WebsiteBodyControl--userMap': props.isUserMap,
        })}
        userLocation={props.userLocation}
        location={props.location}
        wobjectsPoint={props.wobjectsPoint}
        searchType={props.searchType}
      />
      <MapObjectImport
        initialMapSettings={props.mapData}
        usersState={usersState}
        showImportModal={showImportModal}
        closeModal={closeImportModal}
      />
    </>
  );
});

MainMap.propTypes = {
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
  wobjectsPoint: PropTypes.arrayOf(PropTypes.shape({})),
  searchType: PropTypes.string.isRequired,
  hoveredCardPermlink: PropTypes.string.isRequired,
  showReloadButton: PropTypes.bool,
  isSocial: PropTypes.bool,
  isAuth: PropTypes.bool,
  isAdmin: PropTypes.bool,
  settings: PropTypes.shape(),
  socialLoading: PropTypes.bool,
  mapData: PropTypes.shape(),
  setMapData: PropTypes.func.isRequired,
  height: PropTypes.string,
  permlink: PropTypes.string,
  authUserName: PropTypes.string,
  user: PropTypes.string,
  setHeight: PropTypes.func.isRequired,
  boundsParams: PropTypes.shape().isRequired,
  setBoundsParams: PropTypes.func.isRequired,
  infoboxData: PropTypes.shape(),
  setInfoboxData: PropTypes.func.isRequired,
  area: PropTypes.arrayOf(PropTypes.shape()),
  setArea: PropTypes.func.isRequired,
  showLocation: PropTypes.bool.isRequired,
  isUserMap: PropTypes.bool,
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
  isSocial: false,
};

export default connect(
  state => {
    const isGuest = isGuestUser(state);

    return {
      isGuest,
      hasImportAuthority: isGuest
        ? getGuestAuthority(state)
        : getIsConnectMatchBot(state, { botType: MATCH_BOTS_TYPES.IMPORT }),
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
      authUserName: getAuthenticatedUserName(state),
      isAuth: getIsAuthenticated(state),
      isAdmin: getUserAdministrator(state),
      settings: getSettingsSite(state),
    };
  },
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
    getObjectAction,
    setMapData,
    setHeight,
    setBoundsParams,
    setInfoboxData,
    setShowLocation,
    setArea,
    setMapLoading,
    getGuestAuthorityStatus,
  },
)(withRouter(MainMap));
