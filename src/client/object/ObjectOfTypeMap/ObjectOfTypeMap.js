import React, { useState, useEffect, useRef } from 'react';
import { Map } from 'pigeon-maps';
import { get, isEmpty, map, has } from 'lodash';
import { withRouter } from 'react-router-dom';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect, useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Icon, Modal } from 'antd';
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
import { getIsMapModalOpen } from '../../../store/mapStore/mapSelectors';
import { setMapFullscreenMode } from '../../../store/mapStore/mapActions';

const ObjectOfTypeMap = props => {
  const [showMap, setShowMap] = useState('desktopMap');
  const [settingMap, setSettingMap] = useState({});
  const [objects, setObjects] = useState([]);
  const [infoboxData, setInfoboxData] = useState(false);
  const isFullscreenMode = useSelector(getIsMapModalOpen);
  const dispatch = useDispatch();
  const history = useHistory();
  const mapRef = useRef();
  const mapState = {
    desktopMap: get(props.config, 'desktopMap'),
  };

  const emptyMapObject =
    !has(props.wobject, 'mapObjectsList') &&
    !has(props.wobject, 'mapRectangles') &&
    !has(props.wobject, 'mapDesktopView') &&
    !has(props.wobject, 'mapMobileView') &&
    !has(props.wobject, 'mapObjectTypes') &&
    !has(props.wobject, 'mapObjectTags');
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
    defaultCenter = mapDesktopView?.center || defaultCenter;
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
  const successCallback = position => {
    setSettingMap({
      ...position.coords,
      center: [position.coords.latitude, position.coords.longitude],
      zoom: settingMap.zoom,
    });
  };
  const setCoordinates = () =>
    setSettingMap({
      ...settingMap,
      center: [+lat, +lon],
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
  // const handleMarkerClick = ({ payload, anchor }) => {
  //   if (props.isWaivio) {
  //     setInfoboxData({ wobject: payload, coordinates: anchor });
  //   }
  // };
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
          onClick={({ payload, anchor }) =>
            setInfoboxData({ wobject: payload, coordinates: anchor })
          }
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

    if (!isEmpty(settingMap.topPoint) && !isEmpty(settingMap.bottomPoint)) {
      getObjectsForMapObjectType(
        props.wobject.author_permlink,
        body,
        props.locale,
        props.authUserName,
      ).then(r => setObjects(r.result));
    }
  }, [props.wobject.author_permlink, settingMap]);

  const markersLayout = getMarkers(objects);
  const closeModal = () => {
    if (isFullscreenMode) dispatch(setMapFullscreenMode(!isFullscreenMode));
  };

  const openModal = () => {
    dispatch(setMapFullscreenMode(!isFullscreenMode));
  };

  const zoomButtonsLayout = () => (
    <div className="MapOS__zoom">
      <div role="presentation" className="MapOS__zoom-button" onClick={incrementZoom}>
        +
      </div>
      <div role="presentation" className="MapOS__zoom-button" onClick={decrementZoom}>
        -
      </div>
    </div>
  );

  if (emptyMapObject)
    return (
      <div role="presentation" className="Threads__row justify-center">
        <FormattedMessage id="this_map_is_empty" defaultMessage="This map is empty" />
      </div>
    );

  return (
    <div className="MapObjTypeWrap">
      <MapControllers
        isMapObjType
        decrementZoom={decrementZoom}
        incrementZoom={incrementZoom}
        setPosition={setCoordinates}
        successCallback={successCallback}
        rejectCallback={e => console.error(`Map error:${e}`)}
      />
      <Map
        center={get(settingMap, 'center') || get(mapState, [showMap, 'center'], defaultCenter)}
        zoom={get(settingMap, 'zoom', 0) || get(mapState, [showMap, 'zoom'], defaultZoom)}
        height={getCurrentScreenSize()}
        provider={mapProvider}
        onBoundsChanged={state => onBoundsChanged(state, showMap)}
        onClick={({ event }) => {
          event.stopPropagation();
          if (
            ['ObjectOverlayCard__name-truncated', 'avatar-image'].includes(
              event.target.classList.value,
            )
          ) {
            history.push(infoboxData.wobject.defaultShowLink);
          } else if (event.target.classList.value === 'pigeon-overlays') setInfoboxData(null);
        }}
      >
        {markersLayout}
        {infoboxData && getOverlayLayout()}
      </Map>
      <div role="presentation" className="MapOS__fullScreen" onClick={openModal}>
        <Icon type="fullscreen" style={{ fontSize: '25px', color: '#000000' }} />
      </div>
      {isFullscreenMode && (
        <Modal
          title={null}
          footer={null}
          visible={isFullscreenMode}
          onCancel={closeModal}
          style={{ top: 0 }}
          width={'100%'}
          wrapClassName={'MapObjectModal'}
          destroyOnClose
        >
          <div className="MapOS__fullscreenContent">
            <Map
              ref={mapRef}
              center={
                get(settingMap, 'center') || get(mapState, [showMap, 'center'], defaultCenter)
              }
              zoom={get(settingMap, 'zoom', 0) || get(mapState, [showMap, 'zoom'], defaultZoom)}
              provider={mapProvider}
              animate
            >
              {markersLayout}
              {infoboxData && getOverlayLayout()}
            </Map>
            {zoomButtonsLayout()}

            <div className={'MapConfigurationControl__gps'}>
              <div
                role="presentation"
                className="MapConfigurationControl__locateGPS"
                onClick={setCoordinates}
              >
                <img
                  src="/images/focus.svg"
                  alt="aim"
                  className="MapConfigurationControl__locateGPS-button"
                />
              </div>
            </div>
            <div role="presentation" className="MapOS__fullScreen" onClick={openModal}>
              <Icon type="fullscreen-exit" style={{ fontSize: '25px', color: '#000000' }} />
            </div>
          </div>
        </Modal>
      )}
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
  authUserName: PropTypes.string,
  getCurrentUserCoordinates: PropTypes.func,
};

export default connect(
  state => ({
    wobject: getObject(state),
    userLocation: getUserLocation(state),
    config: getConfiguration(state),
    locale: getUsedLocale(state),
    authUserName: getAuthenticatedUserName(state),
    isWaivio: getIsWaivio(state),
  }),
  { getCurrentUserCoordinates: getCoordinates },
)(withRouter(injectIntl(ObjectOfTypeMap)));
