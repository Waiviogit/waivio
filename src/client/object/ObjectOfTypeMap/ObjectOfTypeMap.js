import React, { useState, useEffect, useRef } from 'react';
import { Map } from 'pigeon-maps';
import { get, isEmpty, map, has, debounce } from 'lodash';
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
import { getConfiguration, getSettingsSite } from '../../../store/websiteStore/websiteSelectors';
import { getCurrentScreenSize, getParsedMap } from '../../components/Maps/mapHelpers';
import CustomMarker from '../../components/Maps/CustomMarker';
import { getObject, getWobjectNested } from '../../../store/wObjectStore/wObjectSelectors';
import { getObjectsForMapObjectType, getObject as fetchObject } from '../../../waivioApi/ApiClient';
import {
  getIsWaivio,
  getUsedLocale,
  getUserAdministrator,
} from '../../../store/appStore/appSelectors';
import {
  getAuthenticatedUserName,
  getIsAuthenticated,
  isGuestUser,
} from '../../../store/authStore/authSelectors';
import ObjectOverlayCard from '../../components/Maps/Overlays/ObjectOverlayCard/ObjectOverlayCard';
import { isMobile } from '../../../common/helpers/apiHelpers';
import { getIsMapModalOpen } from '../../../store/mapStore/mapSelectors';
import { setMapFullscreenMode } from '../../../store/mapStore/mapActions';
import useQuery from '../../../hooks/useQuery';
import Loading from '../../components/Icon/Loading';
import './ObjectOfTypeMap.less';
import { getLastPermlinksFromHash } from '../../../common/helpers/wObjectHelper';
import { setNestedWobject } from '../../../store/wObjectStore/wobjActions';
import CatalogBreadcrumb from '../Catalog/CatalogBreadcrumb/CatalogBreadcrumb';
import { handleAddMapCoordinates } from '../../rewards/rewardsHelper';
import MapObjectImport from '../../websites/MapObjectImport/MapObjectImport';
import { hasAccessToImport } from '../../../waivioApi/importApi';

const ObjectOfTypeMap = props => {
  const [showImportModal, setShowImportModal] = useState(false);
  const [usersState, setUsersState] = useState(null);
  const [nestedWobj, setNestedWobj] = useState({});
  const requestPending = useRef(false);
  const query = useQuery();
  const history = useHistory();
  const center = query
    .get('center')
    ?.split(',')
    .map(parseFloat);
  const zoom = parseFloat(query.get('zoom'));
  const topPoint = query
    .get('topPoint')
    ?.split(',')
    .map(parseFloat);
  const bottomPoint = query
    .get('bottomPoint')
    ?.split(',')
    .map(parseFloat);
  const permlink = query?.get('permlink');
  const [settingMap, setSettingMap] = useState({ center, zoom, topPoint, bottomPoint });
  const [isMapReady, setIsMapReady] = useState(false);
  const [objects, setObjects] = useState([]);
  const [showMap, setShowMap] = useState('desktopMap');
  const [selectedObject, setSelectedObject] = useState(
    objects?.find(o => o.author_permlink === permlink),
  );
  const [infoboxData, setInfoboxData] = useState(false);
  const isFullscreenMode = useSelector(getIsMapModalOpen);
  const dispatch = useDispatch();
  const mapRef = useRef();
  const mapState = {
    desktopMap: get(props.config, 'desktopMap'),
  };
  const hash = history.location.hash;
  const nestedObjPermlink = getLastPermlinksFromHash(hash);
  const currentWobject = hash ? nestedWobj : props.wobject;

  const emptyMapObject =
    !has(currentWobject, 'mapObjectsList') &&
    !has(currentWobject, 'mapRectangles') &&
    !has(currentWobject, 'mapDesktopView') &&
    !has(currentWobject, 'mapMobileView') &&
    !has(currentWobject, 'mapObjectTypes') &&
    !has(currentWobject, 'mapObjectTags');
  const { lat, lon } = props.userLocation;
  let defaultCenter = [+lat, +lon];
  let defaultZoom = 8;

  const mapDesktopView = !isEmpty(currentWobject?.mapDesktopView)
    ? JSON.parse(currentWobject?.mapDesktopView)
    : undefined;
  const mapMobileView = !isEmpty(props.wobject?.mapMobileView)
    ? JSON.parse(currentWobject?.mapMobileView)
    : undefined;
  const mapView = isMobile() ? mapMobileView : mapDesktopView;

  defaultCenter = mapView?.center || defaultCenter;
  defaultZoom = mapView?.zoom || defaultZoom;

  const setShowImport = () => {
    setShowImportModal(true);
  };
  const closeImportModal = () => {
    setShowImportModal(false);
  };
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

  const onMarkerClick = ({ payload, anchor }) => {
    handleAddMapCoordinates(anchor);
    if (get(infoboxData, 'coordinates', []) === anchor) {
      setInfoboxData(null);
    }

    query.set('center', anchor);
    query.set('permlink', payload.author_permlink);
    query.set('zoom', settingMap.zoom);
    query.set('topPoint', settingMap.topPoint.join(','));

    history.push(`?${query.toString()}${history.location.hash || ''}`);
    setInfoboxData({ wobject: payload, coordinates: anchor });
    setSelectedObject(payload);
  };
  const getOverlayLayout = () => (
    <Overlay anchor={infoboxData.coordinates} offset={[140, 140]} className="WebsiteBody__overlay">
      <div role="presentation" className="WebsiteBody__overlay-wrap">
        <ObjectOverlayCard isMapObj wObject={infoboxData.wobject} showParent={false} />
      </div>
    </Overlay>
  );
  const closeInfobox = () => {
    history.push(
      `/object/${
        nestedObjPermlink ? props.match.params.name : currentWobject.author_permlink
      }/map?${nestedObjPermlink ? `#${nestedObjPermlink}` : ''}`,
    );

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
        props.match.path?.includes('rewards');

      return latitude && longitude ? (
        <CustomMarker
          key={`obj${wobject.author_permlink}`}
          isMarked={isMarked}
          anchor={[+latitude, +longitude]}
          payload={wobject}
          onClick={onMarkerClick}
          onDoubleClick={closeInfobox}
        />
      ) : null;
    });
  const debouncedGetObjectsForMapObjectType = debounce(
    (authorPermlink, body, locale, authUserName) => {
      if (!requestPending.current) {
        requestPending.current = true;
        getObjectsForMapObjectType(authorPermlink, body, locale, authUserName).then(r => {
          setObjects(r.result);
          setIsMapReady(true);
          requestPending.current = false;
        });
      }
    },
    300,
  );

  useEffect(() => {
    const wobject = objects?.find(o => o.author_permlink === permlink);

    setSelectedObject(wobject);
    const initialInfoboxData =
      !isEmpty(objects) && permlink && (wobject || selectedObject)
        ? {
            wobject: wobject || selectedObject,
            coordinates: center || defaultCenter,
          }
        : null;

    setInfoboxData(initialInfoboxData);
  }, [objects, permlink]);

  useEffect(() => {
    setShowMap({ desktopMap: settingMap });
    const body = {
      box: {
        topPoint: settingMap.topPoint,
        bottomPoint: settingMap.bottomPoint,
      },
      skip: 0,
      limit: 100,
    };

    if (!isEmpty(settingMap.topPoint) && !isEmpty(settingMap.bottomPoint)) {
      debouncedGetObjectsForMapObjectType(
        currentWobject.author_permlink,
        body,
        props.locale,
        props.authUserName,
      );
    } else {
      setIsMapReady(true);
    }
  }, [currentWobject.author_permlink, settingMap, settingMap.zoom]);

  const markersLayout = getMarkers(objects);
  const closeModal = () => {
    if (isFullscreenMode) dispatch(setMapFullscreenMode(false));
  };

  const openModal = () => {
    dispatch(setMapFullscreenMode(true));
  };

  const zoomButtonsLayout = () => (
    <div className={hash ? 'MapOS__zoom MapOS__zoom--nested' : 'MapOS__zoom'}>
      <div role="presentation" className="MapOS__zoom-button" onClick={incrementZoom}>
        +
      </div>
      <div role="presentation" className="MapOS__zoom-button" onClick={decrementZoom}>
        -
      </div>
    </div>
  );

  useEffect(() => {
    if (nestedObjPermlink) {
      setIsMapReady(false);
      fetchObject(nestedObjPermlink, props.authUserName, props.locale).then(wobj => {
        dispatch(setNestedWobject(wobj));
        setNestedWobj(wobj);
        setIsMapReady(true);
      });
    }
  }, [nestedObjPermlink, hash]);

  useEffect(() => {
    hasAccessToImport(props.authUserName).then(r => setUsersState(r));
  }, []);

  if (emptyMapObject && isMapReady)
    return (
      <div role="presentation" className="Threads__row justify-center">
        <FormattedMessage id="this_map_is_empty" defaultMessage="This map is empty" />
      </div>
    );

  return (
    <>
      {hash && <CatalogBreadcrumb wobject={currentWobject} intl={props.intl} />}
      {!isMapReady ? (
        <Loading />
      ) : (
        <div className="MapObjTypeWrap">
          <>
            {isMapReady && (
              <MapControllers
                settings={props.settings}
                isAdmin={props.isAdmin}
                isAuth={props.isAuth}
                isMapObjType
                showImportBtn
                showImport={setShowImport}
                decrementZoom={decrementZoom}
                incrementZoom={incrementZoom}
                setPosition={setCoordinates}
                successCallback={successCallback}
                rejectCallback={e => console.error(`Map error:${e}`)}
              />
            )}
            <Map
              center={
                get(settingMap, 'center') || get(mapState, [showMap, 'center'], defaultCenter)
              }
              zoom={get(settingMap, 'zoom', 0) || get(mapState, [showMap, 'zoom'], defaultZoom) - 1}
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
                } else if (event.target.classList.value === 'pigeon-overlays') {
                  query.delete('permlink');
                  closeInfobox();
                }
              }}
            >
              {markersLayout}
              {infoboxData && getOverlayLayout()}
            </Map>
            {isMapReady && (
              <div role="presentation" className="MapOS__fullScreen" onClick={openModal}>
                <Icon type="fullscreen" style={{ fontSize: '25px', color: '#000000' }} />
              </div>
            )}
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
                    zoom={
                      get(settingMap, 'zoom', 0) || get(mapState, [showMap, 'zoom'], defaultZoom)
                    }
                    provider={mapProvider}
                    animate
                    onBoundsChanged={state => onBoundsChanged(state, showMap)}
                    onClick={({ event }) => {
                      event.stopPropagation();
                      if (
                        ['ObjectOverlayCard__name-truncated', 'avatar-image'].includes(
                          event.target.classList.value,
                        )
                      ) {
                        dispatch(setMapFullscreenMode(false));
                        history.push(infoboxData.wobject.defaultShowLink);
                      } else if (event.target.classList.value === 'pigeon-overlays') {
                        closeInfobox();
                      }
                    }}
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
                  <div role="presentation" className="MapOS__fullScreen" onClick={closeModal}>
                    <Icon type="fullscreen-exit" style={{ fontSize: '25px', color: '#000000' }} />
                  </div>
                </div>
              </Modal>
            )}
          </>
        </div>
      )}
      <MapObjectImport
        usersState={usersState}
        showImportModal={showImportModal}
        closeModal={closeImportModal}
      />
    </>
  );
};

ObjectOfTypeMap.propTypes = {
  match: PropTypes.shape(),
  config: PropTypes.shape(),
  wobject: PropTypes.shape(),
  userLocation: PropTypes.shape(),
  intl: PropTypes.shape(),
  locale: PropTypes.string,
  authUserName: PropTypes.string,
  isAuth: PropTypes.bool,
  isAdmin: PropTypes.bool,
  settings: PropTypes.shape(),
};

export default connect(
  state => ({
    wobject: getObject(state),
    nestedWobject: getWobjectNested(state),
    userLocation: getUserLocation(state),
    config: getConfiguration(state),
    locale: getUsedLocale(state),
    authUserName: getAuthenticatedUserName(state),
    isWaivio: getIsWaivio(state),
    isGuest: isGuestUser(state),
    isAuth: getIsAuthenticated(state),
    isAdmin: getUserAdministrator(state),
    settings: getSettingsSite(state),
  }),
  {},
)(withRouter(injectIntl(ObjectOfTypeMap)));
