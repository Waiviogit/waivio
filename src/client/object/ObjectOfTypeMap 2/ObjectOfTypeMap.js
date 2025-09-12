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
import { getConfiguration } from '../../../store/websiteStore/websiteSelectors';
import { getCurrentScreenSize, getParsedMap } from '../../components/Maps/mapHelpers';
import CustomMarker from '../../components/Maps/CustomMarker';
import { getObject } from '../../../store/wObjectStore/wObjectSelectors';
import { getObjectsForMapObjectType } from '../../../waivioApi/ApiClient';
import { getIsWaivio, getUsedLocale } from '../../../store/appStore/appSelectors';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import ObjectOverlayCard from '../../components/Maps/Overlays/ObjectOverlayCard/ObjectOverlayCard';
import { isMobile } from '../../../common/helpers/apiHelpers';
import { getIsMapModalOpen } from '../../../store/mapStore/mapSelectors';
import { setMapFullscreenMode } from '../../../store/mapStore/mapActions';
import useQuery from '../../../hooks/useQuery';
import Loading from '../../components/Icon/Loading';
import './ObjectOfTypeMap.less';

const ObjectOfTypeMap = props => {
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

  const mapView = isMobile() ? mapMobileView : mapDesktopView;

  defaultCenter = mapView?.center || defaultCenter;
  defaultZoom = mapView?.zoom || defaultZoom;

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

  const onMarkerClick = link => history.push(`/object/${link}`);
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
          <ObjectOverlayCard isMapObj wObject={infoboxData.wobject} showParent={false} />
        </div>
      </Overlay>
    );
  };
  const closeInfobox = () => {
    const url = `center=${settingMap.center.join(',')}&zoom=${
      settingMap.zoom
    }&topPoint=${settingMap.topPoint.join(',')}&bottomPoint=${settingMap.bottomPoint.join(',')}`;

    history.push(`/object/${props.wobject.author_permlink}/map?${url}`);
    setInfoboxData(null);
  };

  const setQueryInUrl = (anchor, link) => {
    const url = `center=${anchor.join(',')}&zoom=${
      settingMap.zoom
    }&topPoint=${settingMap.topPoint.join(',')}&bottomPoint=${settingMap.bottomPoint.join(
      ',',
    )}&permlink=${link}`;

    history.push(`/object/${props.wobject.author_permlink}/map?${url}`);
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
          onClick={({ payload, anchor }) => {
            setSelectedObject(payload);
            setInfoboxData({ wobject: payload, coordinates: anchor });
            setQueryInUrl(anchor, payload.author_permlink);
          }}
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
        props.wobject.author_permlink,
        body,
        props.locale,
        props.authUserName,
      );
    } else {
      setIsMapReady(true);
    }
  }, [props.wobject.author_permlink, settingMap, settingMap.zoom]);

  const markersLayout = getMarkers(objects);
  const closeModal = () => {
    if (isFullscreenMode) dispatch(setMapFullscreenMode(false));
  };

  const openModal = () => {
    dispatch(setMapFullscreenMode(true));
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

  return !isMapReady ? (
    <Loading />
  ) : (
    <div className="MapObjTypeWrap">
      <>
        {isMapReady && (
          <MapControllers
            isMapObjType
            decrementZoom={decrementZoom}
            incrementZoom={incrementZoom}
            setPosition={setCoordinates}
            successCallback={successCallback}
            rejectCallback={e => console.error(`Map error:${e}`)}
          />
        )}
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
            } else if (event.target.classList.value === 'pigeon-overlays') {
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
                zoom={get(settingMap, 'zoom', 0) || get(mapState, [showMap, 'zoom'], defaultZoom)}
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
  );
};

ObjectOfTypeMap.propTypes = {
  match: PropTypes.shape(),
  config: PropTypes.shape(),
  wobject: PropTypes.shape(),
  userLocation: PropTypes.shape(),
  locale: PropTypes.string,
  authUserName: PropTypes.string,
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
  {},
)(withRouter(injectIntl(ObjectOfTypeMap)));
