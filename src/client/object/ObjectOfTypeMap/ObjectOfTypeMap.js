import React, { useState, useEffect } from 'react';
import { Map } from 'pigeon-maps';
import { get, isEmpty, map } from 'lodash';
import { withRouter } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router';
import Overlay from 'pigeon-overlay';

import mapProvider from '../../../common/helpers/mapProvider';
import MapControllers from '../../widgets/MapControllers/MapControllers';
import { getUserLocation } from '../../../store/userStore/userSelectors';
import { getConfiguration } from '../../../store/websiteStore/websiteSelectors';
import { getCoordinates } from '../../../store/userStore/userActions';
import { getCurrentScreenSize, getParsedMap } from '../../components/Maps/mapHelpers';
import CustomMarker from '../../components/Maps/CustomMarker';
import { getObject } from '../../../store/wObjectStore/wObjectSelectors';
import { getObjectsForMapObjectType } from '../../../waivioApi/ApiClient';
import { getIsWaivio, getUsedLocale } from '../../../store/appStore/appSelectors';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import './ObjectOfTypeMap.less';
import ObjectOverlayCard from '../../components/Maps/Overlays/ObjectOverlayCard/ObjectOverlayCard';
import { isMobile } from '../../../common/helpers/apiHelpers';

const ObjectOfTypeMap = props => {
  const [showMap, setShowMap] = useState('desktopMap');
  const [settingMap, setSettingMap] = useState({});
  const [objects, setObjects] = useState([]);
  const [infoboxData, setInfoboxData] = useState(false);
  const history = useHistory();
  const mapState = {
    desktopMap: get(props.config, 'desktopMap'),
  };
  const { lat, lon } = props.userLocation;
  let defaultCenter = [+lat, +lon];
  let defaultZoom = 8;

  const mapDesktopView = !isEmpty(props.wobject?.mapDesktopView)
    ? JSON.parse(props.wobject?.mapDesktopView)
    : undefined;
  const mapMobileView = !isEmpty(props.wobject?.mapMobileView)
    ? JSON.parse(props.wobject?.mapMobileView)
    : undefined;

  if (isMobile()) {
    defaultCenter = mapMobileView?.center || defaultCenter;
    defaultZoom = mapMobileView?.zoom || defaultZoom;
  } else {
    defaultCenter = mapDesktopView.center || defaultCenter;
    defaultZoom = mapDesktopView?.zoom || defaultZoom;
  }

  const decrementZoom = () => {
    if (settingMap.zoom >= 1) {
      setSettingMap({
        ...settingMap,
        zoom: settingMap.zoom - 1,
      });
    }
  };
  const incrementZoom = () => {
    if (settingMap.zoom <= 18) {
      setSettingMap({
        ...settingMap,
        zoom: settingMap.zoom + 1,
      });
    }
  };
  const setCoord = position => {
    setSettingMap({
      ...position.coords,
      center: [position.coords.latitude, position.coords.longitude],
      zoom: settingMap.zoom,
    });
  };
  const setCoordinates = () =>
    setSettingMap({
      ...settingMap,
      center: defaultCenter,
      zoom: settingMap.zoom,
    });

  const onBoundsChanged = state => {
    const { bounds } = state;

    setSettingMap({
      ...state,
      topPoint: [bounds.ne[1], bounds.ne[0]],
      bottomPoint: [bounds.sw[1], bounds.sw[0]],
    });
  };

  const onMarkerClick = permlink => history.push(`/object/${permlink}`);
  const getOverlayLayout = () => {
    const wobjPermlink = get(infoboxData, ['wobject', 'author_permlink']);

    return (
      <Overlay
        anchor={infoboxData.coordinates}
        offset={[140, 140]}
        className="WebsiteBody__overlay"
      >
        <div
          role="presentation"
          className="WebsiteBody__overlay-wrap"
          onClick={() => onMarkerClick(wobjPermlink)}
        >
          <ObjectOverlayCard wObject={infoboxData.wobject} showParent={false} />
        </div>
      </Overlay>
    );
  };
  const handleMarkerClick = ({ payload, anchor }) => {
    if (props.isWaivio) {
      setInfoboxData({ wobject: payload, coordinates: anchor });
    }
  };
  const closeInfobox = () => {
    setInfoboxData(null);
  };
  const getMarkers = wObjects =>
    !isEmpty(wObjects) &&
    map(wObjects, wobject => {
      const parsedMap = getParsedMap(wobject);
      const latitude = get(parsedMap, 'latitude');
      const longitude = get(parsedMap, 'longitude');
      const isMarked =
        Boolean((wobject && wobject.campaigns) || (wobject && !isEmpty(wobject.propositions))) ||
        props.match.path.includes('rewards');

      return latitude && longitude ? (
        <CustomMarker
          key={`obj${wobject.author_permlink}`}
          isMarked={isMarked}
          anchor={[+latitude, +longitude]}
          payload={wobject}
          onClick={handleMarkerClick}
          onDoubleClick={closeInfobox}
        />
      ) : null;
    });

  useEffect(() => {}, [lat, lon, mapDesktopView, mapMobileView]);

  useEffect(() => {
    props.getCurrentUserCoordinates();
  }, []);

  useEffect(() => {
    setShowMap({ desktopMap: settingMap });
    const body = {
      box: {
        topPoint: settingMap.topPoint,
        bottomPoint: settingMap.bottomPoint,
      },
      skip: 0,
      limit: 50,
    };

    if (!isEmpty(settingMap) && !isEmpty(body.box)) {
      getObjectsForMapObjectType(
        props.wobject.author_permlink,
        body,
        props.locale,
        props.authUserName,
      ).then(r => setObjects(r.result));
    }
  }, [props.wobject.author_permlink, settingMap]);

  const setPosition = () => setCoordinates();
  const markersLayout = getMarkers(objects);

  return (
    <div className="MapObjTypeWrap">
      <MapControllers
        decrementZoom={decrementZoom}
        incrementZoom={incrementZoom}
        setPosition={setPosition}
        successCallback={setCoord}
        rejectCallback={e => console.error(`Map error:${e}`)}
      />
      <Map
        center={get(settingMap, 'center') || get(mapState, [showMap, 'center'], defaultCenter)}
        zoom={get(settingMap, 'zoom', 0) || get(mapState, [showMap, 'zoom'], defaultZoom)}
        height={getCurrentScreenSize()}
        provider={mapProvider}
        onBoundsChanged={state => onBoundsChanged(state, showMap)}
      >
        {markersLayout}
        {infoboxData && getOverlayLayout()}
      </Map>
    </div>
  );
};

ObjectOfTypeMap.propTypes = {
  // wobjects: PropTypes.arrayOf(),
  match: PropTypes.shape(),
  config: PropTypes.shape(),
  wobject: PropTypes.shape(),
  userLocation: PropTypes.shape(),
  locale: PropTypes.string,
  isWaivio: PropTypes.bool,
  authUserName: PropTypes.string,
  getCurrentUserCoordinates: PropTypes.func,
};

export default connect(
  state => ({
    wobject: getObject(state),
    // wobjects: getObjectsMap(state),
    userLocation: getUserLocation(state),
    config: getConfiguration(state),
    locale: getUsedLocale(state),
    authUserName: getAuthenticatedUserName(state),
    isWaivio: getIsWaivio(state),
  }),
  { getCurrentUserCoordinates: getCoordinates },
)(withRouter(injectIntl(ObjectOfTypeMap)));
