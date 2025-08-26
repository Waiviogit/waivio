import React, { useState, useEffect } from 'react';
import { Map } from 'pigeon-maps';
import { get, isEmpty, map } from 'lodash';
import { Button, Modal } from 'antd';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import mapProvider from '../../../../../common/helpers/mapProvider';
import { getConfiguration } from '../../../../../store/websiteStore/websiteSelectors';
import { getObjectsMap } from '../../../../../store/mapStore/mapSelectors';
import { getCurrentScreenSize, getParsedMap } from '../../../../components/Maps/mapHelpers';
import CustomMarker from '../../../../components/Maps/CustomMarker';
import MapControllers from '../../../../widgets/MapControllers/MapControllers';
import { getCoordinates } from '../../../../../store/userStore/userActions';
import './MapForms.less';
import { getUserLocation } from '../../../../../store/userStore/userSelectors';

const MapDesktopViewForm = props => {
  const [showMap, setShowMap] = useState('');
  const [settingMap, setSettingMap] = useState({});
  const [mapState, setMapState] = useState({
    mobileMap: get(props.config, 'mobileMap'),
    desktopMap: get(props.config, 'desktopMap'),
  });
  const [paramsSaving, setParamsSaving] = useState(false);
  const { lat, lon } = props.userLocation;
  const isDesktopModalShow = showMap === 'desktopMap';
  const mapModalClassList = classNames('WebsitesConfigurations__modal', {
    'WebsitesConfigurations__modal--desktop': isDesktopModalShow,
  });

  const getMarkers = wObjects =>
    !isEmpty(wObjects) &&
    map(wObjects, wobject => {
      const parsedMap = getParsedMap(get(wobject, ['required_object'], {}));
      const latitude = get(parsedMap, ['latitude']);
      const longitude = get(parsedMap, ['longitude']);
      const isMarked =
        Boolean((wobject && wobject.campaigns) || (wobject && !isEmpty(wobject.propositions))) ||
        props.match.path.includes('rewards');

      return latitude && longitude ? (
        <CustomMarker
          key={`obj${wobject.author_permlink}`}
          isMarked={isMarked}
          anchor={[+latitude, +longitude]}
          payload={wobject}
        />
      ) : null;
    });

  const markersLayout = getMarkers(props.wobjects);

  const closeMapModal = () => {
    setShowMap('');
    setSettingMap({});
  };
  const handleSubmit = param => {
    setParamsSaving(true);
    props.setMap(param);
    setMapState(param);
    setParamsSaving(false);
    setShowMap('');
    setSettingMap({});
  };
  const handleSubmitMap = () =>
    handleSubmit({
      [showMap]: settingMap,
    });
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

  const onBoundsChanged = state =>
    setSettingMap({
      ...state,
      topPoint: [state.bounds.ne[1], state.bounds.ne[0]],
      bottomPoint: [state.bounds.sw[1], state.bounds.sw[0]],
    });

  useEffect(() => {
    props.getCurrentUserCoordinates();
  }, []);

  return (
    <React.Fragment>
      {' '}
      {props.mobileMap ? (
        <React.Fragment>
          <div className="MapForms__mobile-map">
            <div className={classNames('ant-form-item-label AppendForm__appendTitles  map-title')}>
              <FormattedMessage id="object_field_mapMobileView" defaultMessage="Mobile view " />
            </div>
            <Map
              center={get(mapState, ['mobileMap', 'center'], [+lat, +lon])}
              zoom={get(mapState, ['mobileMap', 'zoom'], 10)}
              minZoom={get(mapState, ['mobileMap', 'zoom'], 0)}
              maxZoom={get(mapState, ['mobileMap', 'zoom'], 0)}
              height={450}
              width={300}
              provider={mapProvider}
              mouseEvents={false}
            >
              {markersLayout}
            </Map>
            <Button
              className="MapForms__map-button"
              type="primary"
              onClick={() => setShowMap('mobileMap')}
            >
              {props.intl.formatMessage({
                id: 'select_area',
                defaultMessage: 'Select area',
              })}
            </Button>
            <p>
              {props.intl.formatMessage({
                id: 'mobile_map_description',
                defaultMessage: 'Select the initial map focus for the mobile site.',
              })}
            </p>
          </div>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <div className="MapForms__desktop-map">
            <div className={classNames('ant-form-item-label AppendForm__appendTitles map-title')}>
              <FormattedMessage id="object_field_mapDesktopView" defaultMessage="Desktop view " />
            </div>
            <Map
              center={get(mapState, ['desktopMap', 'center'], [+lat, +lon])}
              zoom={get(mapState, ['desktopMap', 'zoom'], 10)}
              minZoom={get(mapState, ['desktopMap', 'zoom'], 0)}
              maxZoom={get(mapState, ['desktopMap', 'zoom'], 0)}
              provider={mapProvider}
              height={340}
              width={600}
              mouseEvents={false}
            >
              {markersLayout}
            </Map>
            <Button
              className="MapForms__map-button"
              type="primary"
              onClick={() => setShowMap('desktopMap')}
            >
              {props.intl.formatMessage({
                id: 'select_area',
                defaultMessage: 'Select area',
              })}
            </Button>
            <p>
              {props.intl.formatMessage({
                id: 'desktop_map_description',
                defaultMessage: 'Select the initial map focus for the desktop site.',
              })}
            </p>
          </div>
        </React.Fragment>
      )}
      <Modal
        wrapClassName={mapModalClassList}
        title={`Select area`}
        closable
        onCancel={closeMapModal}
        onOk={handleSubmitMap}
        visible={showMap}
        okButtonProps={{
          loading: paramsSaving,
        }}
      >
        {showMap && (
          <div className="MapDesktopMobileWrap">
            <MapControllers
              decrementZoom={decrementZoom}
              incrementZoom={incrementZoom}
              setPosition={setCoordinates}
            />
            <Map
              center={get(settingMap, 'center') || get(mapState, [showMap, 'center'], [+lat, +lon])}
              zoom={get(settingMap, 'zoom', 0) || get(mapState, [showMap, 'zoom'], 8)}
              height={getCurrentScreenSize(isDesktopModalShow)}
              provider={mapProvider}
              onBoundsChanged={state => onBoundsChanged(state, showMap)}
            >
              {markersLayout}
            </Map>
          </div>
        )}
      </Modal>
    </React.Fragment>
  );
};

MapDesktopViewForm.propTypes = {
  wobjects: PropTypes.arrayOf(PropTypes.shape()),
  config: PropTypes.shape(),
  match: PropTypes.shape(),
  userLocation: PropTypes.shape(),
  intl: PropTypes.shape(),
  getCurrentUserCoordinates: PropTypes.func,
  setMap: PropTypes.func,
  mobileMap: PropTypes.bool,
};
export default connect(
  state => ({
    wobjects: getObjectsMap(state),
    userLocation: getUserLocation(state),
    config: getConfiguration(state),
  }),
  { getCurrentUserCoordinates: getCoordinates },
)(withRouter(injectIntl(MapDesktopViewForm)));
