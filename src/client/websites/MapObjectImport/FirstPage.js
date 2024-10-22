import React from 'react';
import { Input, Select } from 'antd';
import { Map } from 'pigeon-maps';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import MapControllers from '../../widgets/MapControllers/MapControllers';
import mapProvider from '../../../common/helpers/mapProvider';
import { supportedGoogleTypes } from '../../components/Maps/mapHelpers';

const FirstPage = ({
  settingMap,
  incrementZoom,
  decrementZoom,
  lat,
  lon,
  openModal,
  setCoordinates,
  setMarker,
  onBoundsChanged,
  marker,
  setName,
  setType,
  setSettingMap,
}) => (
  <div>
    <p>Find objects on Google Maps and import to Waivio</p>
    <div className={'MapObjectImportModal__title-text'}>Set map point:</div>
    <div className="MapDesktopMobileWrap">
      <MapControllers
        decrementZoom={decrementZoom}
        incrementZoom={incrementZoom}
        setPosition={setCoordinates}
        showFullscreenBtn
        openModal={openModal}
        successCallback={geo => {
          setSettingMap({ ...settingMap, center: [geo.coords.latitude, geo.coords.longitude] });
        }}
        rejectCallback={() =>
          setSettingMap({ ...settingMap, center: [location.latitude, location.longitude] })
        }
      />

      <Map
        center={get(settingMap, 'center', [+lat, +lon])}
        zoom={get(settingMap, 'zoom', 8)}
        height={300}
        provider={mapProvider}
        onBoundsChanged={state => onBoundsChanged(state)}
        onClick={setMarker}
      >
        {marker}
      </Map>
    </div>
    <div>
      Zoom in to the maximum level and click to mark the center point for searching nearby objects.
    </div>
    <br />
    <div className={'MapObjectImportModal__title-text'}>
      Search by name in Google Maps (optional):
    </div>
    <Input placeholder={'Enter name'} onInput={e => setName(e.target.value)} />
    <br />
    <div className={'MapObjectImportModal__select-wrap'}>
      <div className={'MapObjectImportModal__title-text'}>Choose Google Maps type (optional):</div>
      <Select
        showSearch
        onChange={v => {
          setType(v);
        }}
      >
        {supportedGoogleTypes.map(t => (
          <Select.Option key={t.value} value={t.value}>
            {t.label}
          </Select.Option>
        ))}
      </Select>
    </div>
  </div>
);

FirstPage.propTypes = {
  incrementZoom: PropTypes.func.isRequired,
  decrementZoom: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
  setSettingMap: PropTypes.func.isRequired,
  setCoordinates: PropTypes.func.isRequired,
  setMarker: PropTypes.func.isRequired,
  onBoundsChanged: PropTypes.func.isRequired,
  setName: PropTypes.func.isRequired,
  setType: PropTypes.func.isRequired,
  marker: PropTypes.node.isRequired,
  lat: PropTypes.number.isRequired,
  lon: PropTypes.number.isRequired,
  settingMap: PropTypes.shape().isRequired,
};
export default FirstPage;
