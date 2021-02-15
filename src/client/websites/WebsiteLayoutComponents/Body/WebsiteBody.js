import React, { useCallback, useEffect, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { isEmpty, get, map, debounce, isEqual } from 'lodash';
import { Helmet } from 'react-helmet';
import { Tag } from 'antd';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import Cookie from 'js-cookie';
import Map from 'pigeon-maps';
import Overlay from 'pigeon-overlay';
import {
  getConfigurationValues,
  getMapForMainPage,
  getScreenSize,
  getSearchFiltersTagCategory,
  getShowSearchResult,
  getUserLocation,
  getWebsiteSearchResult,
  getWebsiteSearchType,
  getWebsiteSearchString,
  getWobjectsPoint,
  isGuestUser,
} from '../../../reducers';
import { getCoordinates } from '../../../user/userActions';
import { setWebsiteSearchFilter, setWebsiteSearchType } from '../../../search/searchActions';
import SearchAllResult from '../../../search/SearchAllResult/SearchAllResult';
import { getWebsiteObjWithCoordinates } from '../../websiteActions';
import mapProvider from '../../../helpers/mapProvider';
import { getParsedMap } from '../../../components/Maps/mapHelper';
import CustomMarker from '../../../components/Maps/CustomMarker';
import DEFAULTS from '../../../object/const/defaultValues';
import { getObjectAvatar, getObjectName } from '../../../helpers/wObjectHelper';
import { handleAddMapCoordinates } from '../../../rewards/rewardsHelper';

import './WebsiteBody.less';

const WebsiteBody = props => {
  const [boundsParams, setBoundsParams] = useState({
    topPoint: [],
    bottomPoint: [],
    limit: 50,
    skip: 0,
  });
  const [infoboxData, setInfoboxData] = useState(null);
  const [area, setArea] = useState({ center: [], zoom: 11, bounds: [] });
  const currentUserLocationCenter = [+props.userLocation.lat, +props.userLocation.lon];
  const isMobile = props.screenSize === 'xsmall' || props.screenSize === 'small';
  const mapClassList = classNames('WebsiteBody__map', { WebsiteBody__hideMap: props.isShowResult });
  const activeFilterIsEmpty = isEmpty(props.activeFilters);
  const configMap = isMobile
    ? get(props.configuration, ['mobileMap', 'center'])
    : get(props.configuration, ['desktopMap', 'center']);

  const currentCenter = isEmpty(configMap)
    ? [+props.userLocation.lat, +props.userLocation.lon]
    : configMap;

  useEffect(() => {
    if (isEmpty(props.userLocation)) {
      props.getCoordinates().then(({ value }) => {
        const center = configMap || [+value.lat, +value.lon];

        setArea({
          center,
          zoom: props.configCoordinates.zoom,
          bounds: [],
        });
      });
    } else {
      setArea({
        center: currentCenter,
        zoom: props.configCoordinates.zoom,
        bounds: [],
      });
    }
  }, []);

  useEffect(() => {
    if (boundsParams.topPoint[0] && boundsParams.bottomPoint[0]) {
      const accessToken = props.isGuest
        ? localStorage.getItem('accessToken')
        : Cookie.get('access_token');
      props.getWebsiteObjWithCoordinates(boundsParams, accessToken);
    }
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
    }, 800),
    [],
  );

  const onBoundsChanged = useCallback(
    debounce(({ center, zoom, bounds }) => {
      if (!isEmpty(center)) setArea({ center, zoom, bounds });
      if (!isEqual(bounds, area.bounds)) {
        handleOnBoundsChanged(bounds);
      }
    }, 500),
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

  let currentWobject = props.wobjectsPoint;

  if (
    (!activeFilterIsEmpty ||
      props.searchString ||
      (!isMobile && props.isShowResult) ||
      (isMobile && props.searchType)) &&
    props.searchType !== 'Users'
  ) {
    currentWobject = props.searchResult;
  }

  const markersLayout = getMarkers(currentWobject);
  const getOverlayLayout = () => {
    const currentWobj = infoboxData;
    const avatar = getObjectAvatar(currentWobj.wobject) || DEFAULTS.AVATAR;
    const name = getObjectName(currentWobj.wobject);

    return (
      <Overlay anchor={infoboxData.coordinates} offset={[-12, 35]}>
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

  const zoomButtonsLayout = () => (
    <div className="WebsiteBodyControl">
      <div className="WebsiteBodyControl__gps">
        <div
          role="presentation"
          className="WebsiteBodyControl__locateGPS"
          onClick={() =>
            setArea({
              ...area,
              zoom: props.configCoordinates.zoom,
              center: currentUserLocationCenter,
            })
          }
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
        {!isEmpty(area.center) && (
          <React.Fragment>
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
  searchResult: PropTypes.arrayOf.isRequired,
  configuration: PropTypes.arrayOf.isRequired,
  screenSize: PropTypes.string.isRequired,
  getWebsiteObjWithCoordinates: PropTypes.func.isRequired,
  setWebsiteSearchFilter: PropTypes.func.isRequired,
  wobjectsPoint: PropTypes.shape(),
  isGuest: PropTypes.bool,
  searchType: PropTypes.string.isRequired,
  configCoordinates: PropTypes.arrayOf.isRequired,
  activeFilters: PropTypes.arrayOf.isRequired,
  searchString: PropTypes.string,
};

WebsiteBody.defaultProps = {
  wobjectsPoint: [],
  isGuest: false,
  searchString: '',
};

export default connect(
  state => ({
    userLocation: getUserLocation(state),
    isShowResult: getShowSearchResult(state),
    searchResult: getWebsiteSearchResult(state),
    configuration: getConfigurationValues(state),
    screenSize: getScreenSize(state),
    wobjectsPoint: getWobjectsPoint(state),
    isGuest: isGuestUser(state),
    configCoordinates: getMapForMainPage(state),
    activeFilters: getSearchFiltersTagCategory(state),
    searchType: getWebsiteSearchType(state),
    searchString: getWebsiteSearchString(state),
  }),
  {
    getCoordinates,
    setWebsiteSearchType,
    getWebsiteObjWithCoordinates,
    setWebsiteSearchFilter,
  },
)(withRouter(WebsiteBody));
