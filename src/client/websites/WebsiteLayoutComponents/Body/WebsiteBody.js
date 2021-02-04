import React, { useEffect, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { isEmpty, get, map, debounce, isEqual } from 'lodash';
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
  getSearchUsersResults,
  getShowSearchResult,
  getUserLocation,
  getWebsiteSearchResult,
  getWobjectsPoint,
  isGuestUser,
} from '../../../reducers';
import { getCoordinates } from '../../../user/userActions';
import { setWebsiteSearchType } from '../../../search/searchActions';
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
  const configDesktopMap = get(props.configuration, ['desktopMap', 'center']);
  const currentCenter = isEmpty(configDesktopMap)
    ? [+props.userLocation.lat, +props.userLocation.lon]
    : configDesktopMap;
  const mapClassList = classNames('WebsiteBody__map', {
    WebsiteBody__hideMap: props.isShowResult,
  });

  useEffect(() => {
    if (isEmpty(props.userLocation))
      props.getCoordinates().then(({ value }) => {
        const center = configDesktopMap || [+value.lat, +value.lon];
        setArea({
          center,
          zoom: props.configCoordinates.zoom,
          bounds: [],
        });
      });
  }, []);

  useEffect(() => {
    if (boundsParams.topPoint[0] && boundsParams.bottomPoint[0]) {
      const accessToken = props.isGuest
        ? localStorage.getItem('accessToken')
        : Cookie.get('access_token');
      props.getWebsiteObjWithCoordinates(boundsParams, accessToken);
    }
  }, [props.userLocation, boundsParams]);

  const isMobile = props.screenSize === 'xsmall' || props.screenSize === 'small';
  const currentLogo = isMobile ? props.configuration.mobileLogo : props.configuration.desktopLogo;
  const aboutObject = get(props, ['configuration', 'aboutObject']);
  const currLink = aboutObject ? `/object/${aboutObject}` : '/';

  const handleOnBoundsChanged = debounce(data => {
    if (!isEmpty(data) && data.ne[0] && data.sw[0]) {
      setBoundsParams({
        ...boundsParams,
        topPoint: [data.ne[1], data.ne[0]],
        bottomPoint: [data.sw[1], data.sw[0]],
      });
    }
  }, 800);

  const onBoundsChanged = debounce(({ center, zoom, bounds }) => {
    if (!isEmpty(center)) setArea({ center, zoom, bounds });
    if (!isEqual(bounds, area.bounds)) {
      handleOnBoundsChanged(bounds);
    }
  }, 300);

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
        />
      ) : null;
    });

  const currentWobject = !isEmpty(props.searchResult) ? props.searchResult : props.wobjectsPoint;

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
          onMouseLeave={() => setInfoboxData(null)}
        >
          <img src={avatar} width={35} height={35} alt={name} />
          <span className="MapOS__overlay-wrap-name">{name}</span>
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
      <SearchAllResult />
      <div className={mapClassList}>
        {currentLogo && (
          // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
          <img
            className="WebsiteBody__logo"
            srcSet={currentLogo}
            alt="your logo"
            styleName="brain-image"
            onClick={() => props.history.push(currLink)}
          />
        )}
        {!isEmpty(currentCenter) && (
          <React.Fragment>
            {zoomButtonsLayout()}
            <Map
              center={area.center}
              zoom={area.zoom}
              provider={mapProvider}
              onBoundsChanged={data => onBoundsChanged(data)}
            >
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
  wobjectsPoint: PropTypes.shape(),
  isGuest: PropTypes.bool,
  configCoordinates: PropTypes.arrayOf.isRequired,
};

WebsiteBody.defaultProps = {
  wobjectsPoint: [],
  isGuest: false,
};

export default connect(
  state => ({
    userLocation: getUserLocation(state),
    isShowResult: getShowSearchResult(state),
    searchResult: getWebsiteSearchResult(state),
    searchByUser: getSearchUsersResults(state),
    configuration: getConfigurationValues(state),
    screenSize: getScreenSize(state),
    wobjectsPoint: getWobjectsPoint(state),
    isGuest: isGuestUser(state),
    configCoordinates: getMapForMainPage(state),
  }),
  {
    getCoordinates,
    setWebsiteSearchType,
    getWebsiteObjWithCoordinates,
  },
)(withRouter(WebsiteBody));
