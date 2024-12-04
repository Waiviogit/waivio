import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { debounce, isEmpty, isEqual, round, get, map } from 'lodash';
import { Map } from 'pigeon-maps';
import { useSelector } from 'react-redux';
import Overlay from 'pigeon-overlay';
import mapProvider from '../../../common/helpers/mapProvider';
import TagFilters from '../TagFilters/TagFilters';
import CustomMarker from '../../components/Maps/CustomMarker';
import MapControllers from '../../widgets/MapControllers/MapControllers';
import { getParsedMap } from '../../components/Maps/mapHelpers';
import { handleAddMapCoordinates } from '../../rewards/rewardsHelper';
import { getObjectName } from '../../../common/helpers/wObjectHelper';
import { getFirstOffsetNumber } from '../helper';
import PostOverlayCard from '../../components/Maps/Overlays/PostOverlayCard/PostOverlayCard';
import ObjectOverlayCard from '../../components/Maps/Overlays/ObjectOverlayCard/ObjectOverlayCard';
import { getWebsiteConfiguration } from '../../../store/appStore/appSelectors';
import { initialColors } from '../constants/colors';

const MainMapView = props => {
  const configuration = useSelector(getWebsiteConfiguration);
  const mainColor = configuration.colors?.mapMarkerBody || initialColors.marker;
  const handleOnBoundsChanged = useCallback(
    debounce(bounds => {
      if (!isEmpty(bounds) && bounds.ne[0] && bounds.sw[0]) {
        props.setBoundsParams({
          topPoint: [bounds.ne[1], bounds.ne[0]],
          bottomPoint: [bounds.sw[1], bounds.sw[0]],
        });
      }
    }, 500),
    [],
  );
  const onBoundsChanged = ({ zoom, center, bounds }) => {
    props.setArea(bounds);
    props.setMapData({ zoom, center });

    if (!isEqual(bounds, props.area)) handleOnBoundsChanged(bounds);
  };

  const resetInfoBox = () => props.setInfoboxData(null);

  const handleClickOnMap = ({ event }) => {
    if (event.target.classList.value === 'pigeon-overlays') {
      resetInfoBox();
      props.query.delete('center');
      props.query.delete('zoom');
      props.query.delete('permlink');
      props.query.delete('currObj');
      props.history.push(`?${props.query.toString()}`);
    }
  };

  const incrementZoom = useCallback(() => {
    if (props.mapData.zoom < 18)
      props.setMapData({ ...props.mapData, zoom: props.mapData.zoom + 1 });
  }, [props.mapData]);

  const decrementZoom = useCallback(() => {
    if (props.mapData.zoom > 1)
      props.setMapData({ ...props.mapData, zoom: props.mapData.zoom - 1 });
  }, [props.mapData]);

  const setLocationFromNavigator = position => {
    const { latitude, longitude } = position.coords;

    props.putUserCoordinates({ latitude, longitude });
    props.setShowLocation(true);
    props.setMapData({ center: [latitude, longitude], zoom: props.mapData.zoom });
  };

  const setLocationFromApi = () => {
    props.setShowLocation(false);
    props.setMapData({
      center: [props.userLocation.lat, props.userLocation.lon],
      zoom: props.mapData.zoom,
    });
  };
  const handleMarkerClick = useCallback(
    ({ payload, anchor }) => {
      handleAddMapCoordinates(anchor);

      if (get(props.infoboxData, 'coordinates', []) === anchor) props.setInfoboxData(null);

      props.query.set('center', anchor);
      props.query.set('zoom', props.mapData.zoom);
      props.query.set('permlink', payload.author_permlink);
      if (props.isSocial && props.location.pathname === '/') {
        props.query.set('currObj', props.wobject.author_permlink);
      }
      props.history.push(`?${props.query.toString()}`);
      props.setInfoboxData({ wobject: payload, coordinates: anchor });
    },
    [props.mapData.zoom, props.location.search, props.isSocial, props.wobject],
  );
  const getOverlayLayout = useCallback(() => {
    if (!props.infoboxData) return null;
    const currentWobj = props.infoboxData;
    const name = getObjectName(currentWobj.wobject);
    const wobject = get(currentWobj, 'wobject', {});
    const firstOffsetNumber = getFirstOffsetNumber(name);
    const setQueryInStorage = () => localStorage.setItem('query', props.query);
    const usersType = props.searchType === 'Users';
    const offset = usersType ? [80, 240] : [firstOffsetNumber, 160];

    return (
      <Overlay
        anchor={props.infoboxData.coordinates}
        offset={offset}
        className="WebsiteBody__overlay"
      >
        <div className="WebsiteBody__overlay-wrap" role="presentation" onClick={setQueryInStorage}>
          {usersType ? (
            <PostOverlayCard wObject={wobject} />
          ) : (
            <ObjectOverlayCard
              isMapObj
              wObject={wobject}
              showParent={props.searchType !== 'restaurant'}
            />
          )}
        </div>
      </Overlay>
    );
  }, [props.infoboxData]);

  const getMarkers = useCallback(
    wObjects => {
      if (isEmpty(wObjects)) return null;

      return map(wObjects, wobject => {
        const parsedMap = getParsedMap(wobject);
        const latitude = get(parsedMap, ['latitude']);
        const longitude = get(parsedMap, ['longitude']);

        if (!latitude && !longitude) return null;

        const isMarked = Boolean(
          get(wobject, 'campaigns') || !isEmpty(get(wobject, 'propositions')),
        );
        const hoveredWobj = props.hoveredCardPermlink === wobject.author_permlink;
        const anchor = [+latitude, +longitude];

        return (
          <CustomMarker
            key={get(wobject, '_id')}
            isMarked={isMarked}
            mainColor={mainColor}
            isPromoted={wobject.isPromotedForSite}
            anchor={anchor}
            payload={wobject}
            onClick={handleMarkerClick}
            onDoubleClick={resetInfoBox}
            hoveredWobj={hoveredWobj}
          />
        );
      });
    },
    [props.wobjectsPoint, props.hoveredCardPermlink, props.location.search],
  );

  const overlay = useMemo(() => getOverlayLayout(), [props.infoboxData]);

  const markersList = useMemo(() => getMarkers(props.wobjectsPoint), [
    props.wobjectsPoint,
    props.hoveredCardPermlink,
  ]);

  return (
    props.showMap && (
      <div className={props.mapClassList} style={{ height: props.mapHeight }}>
        <Map
          ref={props.mapRef}
          center={props.mapData.center}
          height={Number(props.mapHeight)}
          zoom={round(props.mapData.zoom)}
          provider={mapProvider}
          onBoundsChanged={onBoundsChanged}
          onClick={handleClickOnMap}
        >
          <TagFilters query={props.query} history={props.history} />
          {markersList}
          {overlay}
          {props.showLocation && (
            <CustomMarker anchor={[props.userLocation.lat, props.userLocation.lon]} currLocation />
          )}
        </Map>
        <MapControllers
          settings={props.settings}
          isAdmin={props.isAdmin}
          isAuth={props.isAuth}
          isUserMap={props.isUserMap}
          isMapObjType
          className={props.mapControllersClassName}
          decrementZoom={decrementZoom}
          incrementZoom={incrementZoom}
          showImportBtn={props.isSocial || props.isUserMap}
          showImport={props.showImport}
          successCallback={setLocationFromNavigator}
          rejectCallback={setLocationFromApi}
        />
      </div>
    )
  );
};

MainMapView.propTypes = {
  mapData: PropTypes.shape().isRequired,
  userLocation: PropTypes.shape().isRequired,
  infoboxData: PropTypes.shape().isRequired,
  wobject: PropTypes.shape().isRequired,
  history: PropTypes.shape().isRequired,
  query: PropTypes.shape().isRequired,
  area: PropTypes.shape().isRequired,
  location: PropTypes.shape().isRequired,
  mapRef: PropTypes.shape().isRequired,
  setMapData: PropTypes.func.isRequired,
  setBoundsParams: PropTypes.func.isRequired,
  putUserCoordinates: PropTypes.func.isRequired,
  setInfoboxData: PropTypes.func.isRequired,
  setShowLocation: PropTypes.func.isRequired,
  setArea: PropTypes.func.isRequired,
  showMap: PropTypes.bool.isRequired,
  isSocial: PropTypes.bool.isRequired,
  showLocation: PropTypes.bool.isRequired,
  isUserMap: PropTypes.bool.isRequired,
  isAuth: PropTypes.bool.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  settings: PropTypes.shape().isRequired,
  showImport: PropTypes.bool.isRequired,
  mapClassList: PropTypes.string.isRequired,
  searchType: PropTypes.string.isRequired,
  hoveredCardPermlink: PropTypes.string.isRequired,
  mapControllersClassName: PropTypes.string.isRequired,
  mapHeight: PropTypes.number.isRequired,
  wobjectsPoint: PropTypes.arrayOf(PropTypes.shape({})),
};

export default MainMapView;
