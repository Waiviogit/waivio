import React, { useState, useEffect } from 'react';
import { Icon, Modal } from 'antd';
import { Map, Marker } from 'pigeon-maps';
import { get, isEmpty, isNil } from 'lodash';
import classNames from 'classnames';
import { useHistory } from 'react-router';
import { injectIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import StepsItems from '../../widgets/CircleSteps/StepsItems';

import { getUserLocation } from '../../../store/userStore/userSelectors';
import { getCoordinates } from '../../../store/userStore/userActions';
import { getIsMapModalOpen } from '../../../store/mapStore/mapSelectors';
import { setMapFullscreenMode } from '../../../store/mapStore/mapActions';
import './MapObjectImport.less';
import {
  getObjectInfo,
  getObjectsForMapImportObjects,
  getObjectsForMapImportText,
} from '../../../waivioApi/ApiClient';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import '../WebsiteWelcomeModal/WebsiteWelcomeModal.less';
import FirstPage from './FirstPage';
import ModalFooter from './ModalFooter';
import SecondPage from './SecondPage';
import { restaurantGoogleTypes } from '../../components/Maps/mapHelpers';
import mapProvider from '../../../common/helpers/mapProvider';
import { getUsedLocale } from '../../../store/appStore/appSelectors';
import { getObjectTypesList } from '../../../store/objectTypesStore/objectTypesSelectors';
import { prepareAndImportObjects } from '../../../store/slateEditorStore/editorActions';
import { getObjectTypes } from '../../../store/objectTypesStore/objectTypesActions';
import { getSettingsSite } from '../../../store/websiteStore/websiteSelectors';

const stepsConfig = [
  {
    id: 'search',
    title: 'Search',
    num: 1,
  },
  {
    id: 'search_results',
    title: 'Search results',
    num: 2,
  },
];

const MapObjectImportModal = ({
  showImportModal,
  closeImportModal,
  initialMapSettings,
  isEditor,
  isComment,
  parentPost,
  intl,
}) => {
  const settings = useSelector(getSettingsSite);
  const [loading, setLoading] = useState(false);
  const [objects, setObjects] = useState([]);
  const [tagsList, setTagsList] = useState([]);
  const [lists, setLists] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [settingMap, setSettingMap] = useState(initialMapSettings);
  const [checkedIds, setCheckedIds] = useState([]);
  const [markerCoordinates, setMarkerCoordinates] = useState(null);
  const isFirstPage = pageNumber === 1;
  const userLocation = useSelector(getUserLocation);
  const locale = useSelector(getUsedLocale);
  const userName = useSelector(getAuthenticatedUserName);
  const isFullscreenMode = useSelector(getIsMapModalOpen);
  const objectTypes = useSelector(getObjectTypesList);
  const dispatch = useDispatch();
  const history = useHistory();
  const { lat, lon } = userLocation;
  const isRestaurant = object =>
    object?.googleTypes?.some(t => restaurantGoogleTypes.includes(t)) ||
    object?.types?.some(t => restaurantGoogleTypes.includes(t));
  const businessTags = tagsList?.map(t => ({ key: 'Pros', value: t.author_permlink }));
  const restaurantTags = tagsList?.map(t => ({ key: 'Cuisine', value: t.author_permlink }));
  const listAssociations = lists?.map(l => l.author_permlink);

  const getObjects = () => {
    const includedType = isEmpty(type) ? undefined : type;
    const textQuery = isEmpty(name) ? undefined : name;
    const latitude = isNil(markerCoordinates) ? settingMap.center[0] : markerCoordinates[0];
    const longitude = isNil(markerCoordinates) ? settingMap.center[1] : markerCoordinates[1];

    return isEmpty(name)
      ? getObjectsForMapImportObjects(
          userName,
          latitude,
          longitude,
          includedType ? [includedType] : undefined,
        )
      : getObjectsForMapImportText(userName, latitude, longitude, includedType, textQuery);
  };
  const cancelModal = () => {
    closeImportModal();
    setPageNumber(1);
    setLoading(false);
    setObjects([]);
    setTagsList([]);
    setLists([]);
    setName('');
    setType('');
    setSettingMap(initialMapSettings);
    setCheckedIds([]);
    setMarkerCoordinates(null);
  };
  const handleOk = () => {
    if (isFirstPage) {
      setLoading(true);

      getObjects().then(r => {
        setObjects(r.result);
        setLoading(false);
        setCheckedIds(isEditor ? [r.result?.[0]?.id] : r.result?.map(o => o.id));
        setPageNumber(2);
      });
    } else {
      setLoading(true);
      dispatch(
        prepareAndImportObjects(
          isRestaurant,
          isEditor,
          isComment,
          parentPost,
          setLoading,
          cancelModal,
          history,
          objects,
          checkedIds,
          restaurantTags,
          businessTags,
          listAssociations,
          locale,
          userName,
          objectTypes,
          intl,
        ),
      );
    }
  };

  const closeModal = () => {
    dispatch(setMapFullscreenMode(false));
  };

  const openModal = () => {
    dispatch(setMapFullscreenMode(true));
  };
  const onBoundsChanged = state => {
    setSettingMap({
      ...state,
      topPoint: [state.bounds.ne[1], state.bounds.ne[0]],
      bottomPoint: [state.bounds.sw[1], state.bounds.sw[0]],
    });
  };

  const marker = markerCoordinates && (
    <Marker width={50} height={70} color={`#d9534f`} anchor={markerCoordinates} />
  );
  const incrementZoom = () => {
    if (settingMap.zoom <= 18) {
      setSettingMap({
        ...settingMap,
        zoom: settingMap.zoom + 1,
      });
    }
  };

  const decrementZoom = () => {
    if (settingMap.zoom >= 1) {
      setSettingMap({
        ...settingMap,
        zoom: settingMap.zoom - 1,
      });
    }
  };
  const setCoordinates = () =>
    setSettingMap({
      ...settingMap,
      center: [lat, lon],
      zoom: settingMap.zoom,
    });

  const setMarker = event => {
    const latLng = event.latLng;

    if (latLng) {
      setMarkerCoordinates(latLng);
    }
  };

  useEffect(() => {
    !isEditor && dispatch(getCoordinates());
    if (isEmpty(objectTypes)) {
      dispatch(getObjectTypes());
    }
  }, []);
  useEffect(() => {
    if (!isEmpty(settings?.mapImportTag)) {
      getObjectInfo([settings?.mapImportTag]).then(r => {
        setTagsList([r?.wobjects[0]]);
      });
    }
  }, [settings?.mapImportTag]);

  useEffect(() => {
    if (markerCoordinates) {
      setSettingMap({
        ...settingMap,
        center: markerCoordinates,
      });
    }
  }, [markerCoordinates]);

  useEffect(() => {
    setSettingMap(initialMapSettings);
  }, [initialMapSettings]);

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

  return (
    <>
      <Modal
        className={'MapObjectImportModal'}
        onCancel={cancelModal}
        footer={
          <ModalFooter
            loading={loading}
            closeImportModal={cancelModal}
            pageNumber={pageNumber}
            handleOk={handleOk}
            setPageNumber={setPageNumber}
            disabled={pageNumber === 1 ? isNil(markerCoordinates) : isEmpty(objects)}
          />
        }
        visible={showImportModal}
        title={'Nearby'}
      >
        <StepsItems config={stepsConfig} activeStep={pageNumber} isThirdPageVisible />
        <br />
        {isFirstPage ? (
          <FirstPage
            zoomButtonsLayout={zoomButtonsLayout}
            onBoundsChanged={onBoundsChanged}
            lat={lat}
            setMarker={setMarker}
            marker={marker}
            settingMap={settingMap}
            setCoordinates={setCoordinates}
            openModal={openModal}
            lon={lon}
            setName={setName}
            setType={setType}
            name={name}
            type={type}
          />
        ) : (
          <SecondPage
            isEditor={isEditor}
            tagsList={tagsList}
            setTagsList={setTagsList}
            setLists={setLists}
            listAssociations={listAssociations}
            lists={lists}
            objects={objects}
            checkedIds={checkedIds}
            setCheckedIds={setCheckedIds}
          />
        )}
      </Modal>
      {isFullscreenMode && (
        <Modal
          title={null}
          footer={null}
          visible={isFullscreenMode}
          onCancel={closeModal}
          style={{ top: 0 }}
          width={'100%'}
          wrapClassName={classNames('MapModal', { MapModalSocial: true })}
          destroyOnClose
        >
          <div className="MapOS__fullscreenContent">
            <Map
              center={get(settingMap, 'center', [+lat, +lon])}
              zoom={get(settingMap, 'zoom', 8)}
              animate
              provider={mapProvider}
              // onBoundsChanged={state => onBoundsChanged(state)}
              onClick={setMarker}
            >
              {marker}
            </Map>
          </div>
          {zoomButtonsLayout()}
          <div
            role="presentation"
            className="MapOS__locateGPS"
            onClick={setCoordinates}
            title="find me"
          >
            <div className={'MapOS__locateGPS-button-container'}>
              <img src={'/images/focus.svg'} alt="aim" className="MapOS__locateGPS-button" />
            </div>
          </div>
          <div role="presentation" className="MapOS__fullScreen" onClick={closeModal}>
            <Icon type="fullscreen-exit" style={{ fontSize: '25px', color: '#000000' }} />
          </div>
        </Modal>
      )}
    </>
  );
};

MapObjectImportModal.propTypes = {
  closeImportModal: PropTypes.func.isRequired,
  showImportModal: PropTypes.func.isRequired,
  initialMapSettings: PropTypes.shape().isRequired,
  intl: PropTypes.shape(),
  parentPost: PropTypes.shape(),
  isEditor: PropTypes.bool,
  isComment: PropTypes.bool,
};

export default injectIntl(MapObjectImportModal);
