import React, { useState, useEffect } from 'react';
import { Icon, message, Modal } from 'antd';
import { Map, Marker } from 'pigeon-maps';
import { get, isEmpty, isNil } from 'lodash';
import classNames from 'classnames';
import uuidv4 from 'uuid/v4';
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
  getObjectsForMapImportAvatars,
  getObjectsForMapImportObjects,
  getObjectsForMapImportText,
} from '../../../waivioApi/ApiClient';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import '../WebsiteWelcomeModal/WebsiteWelcomeModal.less';
import FirstPage from './FirstPage';
import ModalFooter from './ModalFooter';
import SecondPage from './SecondPage';
import {
  formBusinessObjects,
  handleArrayToFile,
  restaurantGoogleTypes,
} from '../../components/Maps/mapHelpers';
import { getUsedLocale } from '../../../store/appStore/appSelectors';
import { uploadObject } from '../../../waivioApi/importApi';
import mapProvider from '../../../common/helpers/mapProvider';

const stepsConfig = [
  {
    id: 'search',
    title: 'Search',
    num: 1,
  },
  {
    id: 'data_import',
    title: 'Data import',
    num: 2,
  },
];

const MapObjectImportModal = ({ showImportModal, closeImportModal }) => {
  const [loading, setLoading] = useState(false);
  const [objects, setObjects] = useState([]);
  const [tagsList, setTagsList] = useState([]);
  const [lists, setLists] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [settingMap, setSettingMap] = useState({});
  const [checkedIds, setCheckedIds] = useState([]);
  const [markerCoordinates, setMarkerCoordinates] = useState(null);
  const isFirstPage = pageNumber === 1;
  const userLocation = useSelector(getUserLocation);
  const locale = useSelector(getUsedLocale);
  const userName = useSelector(getAuthenticatedUserName);
  const isFullscreenMode = useSelector(getIsMapModalOpen);
  const dispatch = useDispatch();
  const { lat, lon } = userLocation;
  const waivioTags = tagsList?.map(t => ({ key: 'Pros', value: t.name }));
  const listAssociations = lists?.map(l => l.author_permlink);

  const getAvatar = async ({ detailsPhotos, user }) => {
    // eslint-disable-next-line no-restricted-syntax
    for (const photo of detailsPhotos) {
      // eslint-disable-next-line no-await-in-loop
      const { result: photoString, error: photoError } = await getObjectsForMapImportAvatars(
        user,
        photo.name,
      );

      if (photoError || !photoString) {
        // eslint-disable-next-line no-continue
        continue;
      }

      return photoString;
    }

    return '';
  };

  const prepareObjects = async () => {
    const filteredObjects = objects?.filter(obj => checkedIds?.includes(obj.id));

    // eslint-disable-next-line no-return-await
    return await Promise.all(
      filteredObjects?.map(async object => {
        const processed = formBusinessObjects({
          object,
          waivio_tags: waivioTags,
          listAssociations,
        });

        const avatar = await getAvatar({
          detailsPhotos: object?.photos ?? [],
          user: userName,
        });

        if (avatar) {
          processed.primaryImageURLs = [avatar];
        }

        return processed;
      }),
    );
  };

  const getObjects = () => {
    const includedType = isEmpty(type) ? undefined : type;
    const textQuery = isEmpty(name) ? undefined : name;

    return isEmpty(name)
      ? getObjectsForMapImportObjects(
          userName,
          markerCoordinates[0],
          markerCoordinates[1],
          includedType ? [includedType] : undefined,
        )
      : getObjectsForMapImportText(
          userName,
          markerCoordinates[0],
          markerCoordinates[1],
          includedType,
          textQuery,
        );
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
    setSettingMap({});
    setCheckedIds([]);
    setMarkerCoordinates(null);
  };
  const handleOk = () => {
    if (isFirstPage) {
      setLoading(true);
      if (!isEmpty(markerCoordinates)) {
        getObjects().then(r => {
          setObjects(r.result);
          setLoading(false);
          setCheckedIds(r.result?.map(o => o.id));
          setPageNumber(2);
        });
      }
    } else {
      setLoading(true);

      prepareObjects().then(processedObjects => {
        const businessObjects = [];
        const restaurantObjects = [];

        processedObjects.forEach(obj => {
          const isRestaurant = obj?.googleTypes?.some(t => restaurantGoogleTypes.includes(t));

          if (isRestaurant) {
            restaurantObjects.push(obj);
          } else {
            businessObjects.push(obj);
          }
        });

        const uploadedBusinessFile = handleArrayToFile(businessObjects);
        const businessFormData = new FormData();
        const uploadedRestaurantFile = handleArrayToFile(restaurantObjects);
        const restaurantFormData = new FormData();

        businessFormData.append('file', uploadedBusinessFile, `${uuidv4()}.json`);
        businessFormData.append('user', userName);
        businessFormData.append('locale', locale);
        businessFormData.append('objectType', 'business');
        businessFormData.append('authority', 'administrative');
        businessFormData.append('useGPT', true);
        businessFormData.append('forceImport', true);
        restaurantFormData.append('file', uploadedRestaurantFile, `${uuidv4()}-1.json`);
        restaurantFormData.append('user', userName);
        restaurantFormData.append('locale', locale);
        restaurantFormData.append('objectType', 'restaurant');
        restaurantFormData.append('authority', 'administrative');
        restaurantFormData.append('useGPT', true);
        restaurantFormData.append('forceImport', true);

        if (!isEmpty(businessObjects))
          uploadObject(businessFormData)
            .then(async res => {
              setLoading(false);
              cancelModal();

              if (!res.ok) {
                message.error('An error occurred');
              } else {
                message.success('Data import started successfully!');
              }
            })
            .catch(error => {
              setLoading(false);
              message.error('Failed to upload. Please check your network connection.');
              console.error('Network Error:', error);
            });

        if (!isEmpty(restaurantObjects))
          uploadObject(restaurantFormData)
            .then(async res => {
              setLoading(false);

              // Since the response will be opaque, you cannot access its body
              if (!res.ok) {
                message.error('An error occurred');
              } else {
                cancelModal();
                message.success('Data import started successfully!');
              }
            })
            .catch(error => {
              setLoading(false);
              message.error('Failed to upload. Please check your network connection.');
              console.error('Network Error:', error);
            });
      });
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
    dispatch(getCoordinates());
  }, []);

  useEffect(() => {
    if (markerCoordinates) {
      setSettingMap({
        ...settingMap,
        center: markerCoordinates,
      });
    }
  }, [markerCoordinates]);

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
            tagsList={tagsList}
            setTagsList={setTagsList}
            setLists={setLists}
            listAssociations={listAssociations}
            lists={lists}
            waivioTags={waivioTags}
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
};

export default injectIntl(MapObjectImportModal);
