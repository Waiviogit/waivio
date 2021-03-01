import React, { useCallback, useEffect, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { isEmpty, get, map, debounce, isEqual } from 'lodash';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { Tag } from 'antd';
import PropTypes from 'prop-types';
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
} from '../../../reducers';
import { getCoordinates } from '../../../user/userActions';
import { setWebsiteSearchFilter, setWebsiteSearchType } from '../../../search/searchActions';
import SearchAllResult from '../../../search/SearchAllResult/SearchAllResult';
import mapProvider from '../../../helpers/mapProvider';
import { getParsedMap } from '../../../components/Maps/mapHelper';
import CustomMarker from '../../../components/Maps/CustomMarker';
import DEFAULTS from '../../../object/const/defaultValues';
import { getCurrentPoint, getObjectAvatar, getObjectName } from '../../../helpers/wObjectHelper';
import { handleAddMapCoordinates } from '../../../rewards/rewardsHelper';
import {
  getCurrentAppSettings,
  getReservedCounter,
  putUserCoordinates,
} from '../../../app/appActions';

import './WebsiteBody.less';
import { getWebsiteObjWithCoordinates } from '../../websiteActions';

const WebsiteBody = props => {
  const [boundsParams, setBoundsParams] = useState({
    topPoint: [],
    bottomPoint: [],
  });
  const [infoboxData, setInfoboxData] = useState(null);
  const [area, setArea] = useState({ center: [], zoom: 11, bounds: [] });
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
      setCurrMapConfig(queryCenter, 15);
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

  useEffect(() => {
    if (props.isAuth) props.getReservedCounter();
    getCoordinatesForMap();
  }, []);

  useEffect(() => {
    const { topPoint, bottomPoint } = boundsParams;
    if (!isEmpty(topPoint) && !isEmpty(bottomPoint))
      props.getWebsiteObjWithCoordinates({ topPoint, bottomPoint }, 50).then(res => {
        if (!isEmpty(queryCenter)) {
          const { wobjects } = res.value;
          const currentPoint = getCurrentPoint(wobjects, queryCenter);

          props.history.push('/');
          setInfoboxData({
            wobject: currentPoint,
            coordinates: queryCenter,
          });
        }
      });
  }, [props.userLocation, boundsParams]);

  const aboutObject = get(props, ['configuration', 'aboutObject'], {});
  const configLogo = isMobile ? props.configuration.mobileLogo : props.configuration.desktopLogo;
  const currentLogo = configLogo || getObjectAvatar(aboutObject);
  const logoLink = get(aboutObject, ['defaultShowLink'], '/');

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

  const handleMarkerClick = ({ payload, anchor }) => {
    handleAddMapCoordinates(anchor);
    if (get(infoboxData, 'coordinates', []) === anchor) {
      setInfoboxData({ infoboxData: null });
    }

    setInfoboxData({ wobject: payload, coordinates: anchor });
  };

  const getMarkers = wObjects =>
    !isEmpty(wObjects) &&
    map(wObjects, wobject => {
      const parsedMap = getParsedMap(wobject);
      const latitude = get(parsedMap, ['latitude']);
      const longitude = get(parsedMap, ['longitude']);
      const isMarked = get(wobject, 'campaigns') || !isEmpty(get(wobject, 'propositions'));

      return latitude && longitude ? (
        <CustomMarker
          key={`obj${wobject.author_permlink}`}
          isMarked={isMarked}
          anchor={[+latitude, +longitude]}
          payload={wobject}
          onClick={handleMarkerClick}
          onDoubleClick={() => setInfoboxData(null)}
        />
      ) : null;
    });

  const markersLayout = getMarkers(props.wobjectsPoint);

  const getOverlayLayout = () => {
    const currentWobj = infoboxData;
    const avatar = getObjectAvatar(currentWobj.wobject) || DEFAULTS.AVATAR;
    const name = getObjectName(currentWobj.wobject);
    const getFirstOffsetNumber = () => {
      const lengthMoreThanOrSame = number => name.length <= number;

      if (lengthMoreThanOrSame(15)) return 65;
      if (lengthMoreThanOrSame(20)) return 100;
      if (lengthMoreThanOrSame(35)) return 120;

      return 170;
    };
    const firstOffsetNumber = getFirstOffsetNumber();

    return (
      <Overlay anchor={infoboxData.coordinates} offset={[firstOffsetNumber, 75]}>
        <Link
          role="presentation"
          className="WebsiteBody__overlay-wrap"
          to={`/object/${currentWobj.wobject.author_permlink}`}
        >
          <img src={avatar} width={35} height={35} alt={name} />
          <span data-anchor={name} className="MapOS__overlay-wrap-name">
            {name}
          </span>
        </Link>
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
        <title>{getObjectName(aboutObject)}</title>
        <meta
          property="twitter:description"
          content="Waivio is an open distributed attention marketplace for business"
        />
        <link id="favicon" rel="icon" href={getObjectAvatar(aboutObject)} type="image/x-icon" />
      </Helmet>
      <SearchAllResult />
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
              <Link to="/rewards/reserved" className="WebsiteBody__reserved">
                <FormattedMessage id="reserved" defaultMessage="Reserved" />: {props.counter}
              </Link>
            )}
            {zoomButtonsLayout()}
            <Map
              center={area.center}
              zoom={area.zoom}
              provider={mapProvider}
              onBoundsChanged={data => onBoundsChanged(data)}
              onClick={({ event }) => {
                if (!get(event, 'target.dataset.anchor')) setInfoboxData(null);
              }}
            >
              {!isEmpty(props.activeFilters) && (
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
              {markersLayout}
              {infoboxData && getOverlayLayout()}
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
    lat: PropTypes.string,
    lon: PropTypes.string,
  }).isRequired,
  isShowResult: PropTypes.string.isRequired,
  configuration: PropTypes.arrayOf.isRequired,
  screenSize: PropTypes.string.isRequired,
  getWebsiteObjWithCoordinates: PropTypes.func.isRequired,
  setWebsiteSearchFilter: PropTypes.func.isRequired,
  getReservedCounter: PropTypes.func.isRequired,
  putUserCoordinates: PropTypes.func.isRequired,
  getCurrentAppSettings: PropTypes.func.isRequired,
  wobjectsPoint: PropTypes.shape(),
  // eslint-disable-next-line react/no-unused-prop-types
  configCoordinates: PropTypes.arrayOf.isRequired,
  activeFilters: PropTypes.arrayOf.isRequired,
  counter: PropTypes.number.isRequired,
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
  }),
  {
    getCoordinates,
    setWebsiteSearchType,
    getWebsiteObjWithCoordinates,
    setWebsiteSearchFilter,
    getReservedCounter,
    putUserCoordinates,
    getCurrentAppSettings,
  },
)(withRouter(WebsiteBody));
